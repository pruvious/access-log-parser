import { defineJob, type CreateInput } from '#pruvious'
import { query } from '#pruvious/server'
import { Parser } from '~/utils/Parser'
import { getLocation } from '~/utils/geoip'

export default defineJob({
  name: 'parse-logs',
  interval: 60,
  callback: async () => {
    const { accessLogPaths } = await query('settings').read()
    const visitorsMap: Record<string, number> = {}

    for (const { path, site } of accessLogPaths) {
      const parser = new Parser(path)
      const newImpressions: CreateInput['impressions'][] = []
      const latestImpressionTime = (await query('impressions').where('site', site).max('time')) ?? 0
      const recentImpressions = await query('impressions')
        .where('site', site)
        .whereGte('time', latestImpressionTime - 60000)
        .populate()
        .all()

      for (const entry of parser.walk()) {
        if (entry.status !== 200 || !entry.request.match(/^GET (\/(?!api(?!\/pages\/))[^\.]*) HTTP/)) {
          continue
        }

        const page = entry.request
          .slice(4)
          .split(' ')[0]
          .replace(/^\/api\/pages\//, '/')

        if (
          entry.time >= latestImpressionTime &&
          !recentImpressions.some(
            (impression) =>
              impression.visitor!.visitorId === entry.visitorId &&
              impression.site === site &&
              impression.page === page &&
              impression.referrer === entry.referrer &&
              impression.time === entry.time,
          )
        ) {
          if (!visitorsMap[entry.visitorId]) {
            const visitor = await query('visitors').select({ id: true }).where('visitorId', entry.visitorId).first()

            if (visitor) {
              visitorsMap[entry.visitorId] = visitor.id
            }
          }

          if (!visitorsMap[entry.visitorId]) {
            const createVisitor = await query('visitors').create({
              visitorId: entry.visitorId,
              userAgent: entry.userAgent,
              os: entry.os,
              ...(await getLocation(entry.ip)),
            })

            if (createVisitor.success) {
              visitorsMap[entry.visitorId] = createVisitor.record.id
            } else {
              continue
            }
          }

          newImpressions.push({
            page,
            site: site,
            visitor: visitorsMap[entry.visitorId],
            referrer: entry.referrer,
            time: entry.time,
          })
        } else {
          break
        }
      }

      if (newImpressions.length) {
        await query('impressions').createMany(newImpressions)
      }
    }
  },
})
