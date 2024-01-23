import { isInteger, isString } from '#pruvious'
import type { H3Event } from 'h3'

/**
 * Validate the request and its params and return the parsed site name and time range.
 */
export function parseRequest(event: H3Event): {
  site: string
  from: number
  to: number
  timezoneOffset: number
  error?: string
} {
  const queryParams = getQuery(event)
  const result = { site: '', from: 0, to: 0, timezoneOffset: 0 }

  if (!event.context.auth.isLoggedIn) {
    setResponseStatus(event, 401)
    return { error: 'Unauthorized due to either invalid credentials or missing authentication', ...result }
  }

  if (!isString(queryParams.site)) {
    setResponseStatus(event, 400)
    return { error: `Missing 'site' query parameter`, ...result }
  } else if (!isString(queryParams.from)) {
    setResponseStatus(event, 400)
    return { error: `Missing 'from' query parameter`, ...result }
  } else if (!isString(queryParams.to)) {
    setResponseStatus(event, 400)
    return { error: `Missing 'to' query parameter`, ...result }
  }

  const from = parseInt(queryParams.from)
  const to = parseInt(queryParams.to)
  const timezoneOffset = isString(queryParams.timezoneOffset) ? parseInt(queryParams.timezoneOffset) : 0

  if (!isInteger(from) || String(from) !== queryParams.from) {
    setResponseStatus(event, 400)
    return { error: `Query parameter 'from' must be an integer`, ...result }
  } else if (!isInteger(to) || String(to) !== queryParams.to) {
    setResponseStatus(event, 400)
    return { error: `Query parameter 'to' must be an integer`, ...result }
  } else if (from > to) {
    setResponseStatus(event, 400)
    return { error: `Query parameter 'from' must be less than or equal to 'to'`, ...result }
  } else if (
    !isInteger(timezoneOffset) ||
    (queryParams.timezoneOffset && String(timezoneOffset) !== queryParams.timezoneOffset)
  ) {
    setResponseStatus(event, 400)
    return { error: `Query parameter 'timezoneOffset' must be an integer`, ...result }
  }

  return { site: queryParams.site, from, to, timezoneOffset }
}
