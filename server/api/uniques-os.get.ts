import { rawQuery } from '#pruvious/server'
import { parseRequest } from '~/utils/request'

export default defineEventHandler(async (event) => {
  const { site, from, to, error } = parseRequest(event)

  if (error) {
    return error
  }

  const { results } = await rawQuery(
    `SELECT visitors.os as label, COUNT(DISTINCT impressions.visitor) AS count
     FROM visitors
     JOIN impressions ON visitors.id = impressions.visitor
     WHERE impressions.site = :site
       AND impressions.time >= :from 
       AND impressions.time <= :to
     GROUP BY label
     ORDER BY count DESC`,
    { site, from, to },
  )

  return results.map(({ label, count }: any) => ({ label, count: +count }))
})
