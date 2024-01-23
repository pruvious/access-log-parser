import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
} from 'date-fns'

/**
 * Get the chart intervals based on the selected time range.
 *
 * - `> 1 year`: yearly
 * - `>= 1 month`: monthly
 * - `> 1 day`: daily
 * - `> 1 hour`: hourly
 * - `<= 1 hour`: every 10 minutes
 */
export function getIntervals(timeRange: [number, number]): number[] {
  const [start, end] = timeRange
  const diff = end - start

  if (diff > 365 * 24 * 60 * 60 * 1000) {
    // Yearly
    return eachYearOfInterval({ start, end }).map((date) => date.getTime())
  } else if (diff >= 31 * 24 * 60 * 60 * 1000) {
    // Monthly
    return eachMonthOfInterval({ start, end }).map((date) => date.getTime())
  } else if (diff > 24 * 60 * 60 * 1000) {
    // Daily
    return eachDayOfInterval({ start, end }).map((date) => date.getTime())
  } else if (diff > 60 * 60 * 1000) {
    // Hourly
    return eachHourOfInterval({ start, end }).map((date) => date.getTime())
  }

  // Every 10 minutes
  return eachMinuteOfInterval({ start, end }, { step: 10 }).map((date) => date.getTime())
}

/**
 * Get the chart labels based on the time intervals.
 */
export function getIntervalLabels(intervals: number[], timezoneOffset = 0): string[] {
  const diff = intervals[intervals.length - 1] - intervals[0]
  const serverOffset = new Date().getTimezoneOffset()

  if (diff > 365 * 24 * 60 * 60 * 1000) {
    return intervals.map((interval) => format(interval + (serverOffset - timezoneOffset) * 60 * 1000, 'yyyy'))
  } else if (diff >= 31 * 24 * 60 * 60 * 1000) {
    return intervals.map((interval) => format(interval + (serverOffset - timezoneOffset) * 60 * 1000, 'MMM yyyy'))
  } else if (diff > 24 * 60 * 60 * 1000) {
    return intervals.map((interval) => format(interval + (serverOffset - timezoneOffset) * 60 * 1000, 'MMM d'))
  }

  return intervals.map((interval) => format(interval + (serverOffset - timezoneOffset) * 60 * 1000, 'HH:mm'))
}
