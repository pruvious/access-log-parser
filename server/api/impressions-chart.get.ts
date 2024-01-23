import { query } from '#pruvious/server'
import { getIntervalLabels, getIntervals } from '~/utils/intervals'
import { parseRequest } from '~/utils/request'

export default defineEventHandler(async (event) => {
  const { site, from, to, timezoneOffset, error } = parseRequest(event)

  if (error) {
    return error
  }

  const data: number[] = []
  const intervals = getIntervals([from, to])

  for (let i = 0; i < intervals.length; i++) {
    data.push(
      await query('impressions')
        .where('site', site)
        .whereGte('time', i === 0 ? Math.max(intervals[i], from) : intervals[i])
        .whereLte('time', intervals[i + 1] || to)
        .count(),
    )
  }

  return { data, labels: getIntervalLabels(intervals, timezoneOffset) }
})
