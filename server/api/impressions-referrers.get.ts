import { rawQuery } from '#pruvious/server'
import { parseRequest } from '~/utils/request'

export default defineEventHandler(async (event) => {
  const { site, from, to, error } = parseRequest(event)

  if (error) {
    return error
  }

  const { results } = await rawQuery(
    `SELECT referrer as label, COUNT(visitor) AS count
     FROM impressions
     WHERE site = :site
       AND time >= :from 
       AND time <= :to
     GROUP BY label
     ORDER BY count DESC`,
    { site, from, to },
  )

  return results.map(({ label, count }: any) => ({ label, count: +count }))
})
