import crypto from 'crypto'
import { parse } from 'date-fns'
import fs from 'fs'

export interface ParsedRow {
  /**
   * The visitor ID is a hash of the IP address and user agent.
   */
  visitorId: string

  /**
   * The IP address of the client (remote host) which made the request.
   */
  ip: string

  /**
   * The HTTP method, URI, and protocol of the request.
   */
  request: string

  /**
   * The HTTP status code of the response.
   */
  status: number

  /**
   * The referrer URL of the request.
   */
  referrer: string

  /**
   * Information about the user agent (web browser) used to make the request,
   * including the browser's name, version, and the operating system it is running on.
   */
  userAgent: string

  /**
   * The operating system name (Windows, macOS, Linux, Android, iOS, or Unknown)
   */
  os: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown'

  /**
   * The timestamp of the request in milliseconds.
   */
  time: number
}

/**
 * Create a new access log parser.
 *
 * @throws An error if the file does not exist.
 *
 * @example
 * ```typescript
 * const parser = new Parser('/var/log/nginx/access.log')
 * ```
 */
export class Parser {
  protected rows: string[] = []

  constructor(protected file: string) {
    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`)
    }

    this.rows = fs.readFileSync(file, 'utf-8').split('\n')
  }

  /**
   * Walk through the access log file and yield each row.
   *
   * @example
   * ```typescript
   * for (const { visitorId, site, page, userAgent, os, time } of parser.walk()) {
   *   // ...
   * }
   * ```
   */
  *walk(): IterableIterator<ParsedRow> {
    for (let i = this.rows.length; i > 0; i--) {
      const parsed = this.parseRow(i)

      if (parsed) {
        yield parsed
      }
    }
  }

  /**
   * Parse a row from the access log file.
   * If the row `index` is out of bounds or the row is invalid, `null` is returned.
   *
   * Note: The `index` starts at 1, not 0.
   */
  parseRow(index: number): ParsedRow | null {
    const row = this.rows[index - 1]

    if (!row) {
      return null
    }

    const col: string[] = this.parseColumns(row)
    const ip = col[0]
    const dateTime = col[3]
    const request = col[4]
    const status = +col[5]
    const referrer = col[7]
    const userAgent = col[8]

    if (!referrer || referrer === '-') {
      return null
    }

    return {
      visitorId: crypto
        .createHash('sha256')
        .update(ip + userAgent)
        .digest('hex'),
      request,
      status,
      referrer,
      ip,
      userAgent,
      os: Parser.getOSName(userAgent),
      time: Parser.getTimestamp(dateTime),
    }
  }

  /**
   * Get the operating system name from the user agent string.
   */
  static getOSName(userAgent: string) {
    const osRegex = /\(([^)]+)/
    const osMatches = userAgent.match(osRegex)

    if (osMatches) {
      const osInfo = osMatches[1]

      if (osInfo.includes('Windows')) {
        return 'Windows'
      } else if (osInfo.includes('Macintosh') || osInfo.includes('Mac OS X')) {
        return 'macOS'
      } else if (osInfo.includes('Linux')) {
        return 'Linux'
      } else if (osInfo.includes('Android')) {
        return 'Android'
      } else if (osInfo.includes('iPhone') || osInfo.includes('iPad') || osInfo.includes('iOS')) {
        return 'iOS'
      }
    }

    return 'Unknown'
  }

  /**
   * Get a timestmap in milliseconds from a nginx date time string.
   */
  static getTimestamp(dateTime: string) {
    return parse(dateTime, 'dd/MMM/yyyy:HH:mm:ss X', new Date()).getTime()
  }

  /**
   * Parse a row from the access log file.
   */
  protected parseColumns(row: string): string[] {
    const columns: string[] = []

    let column = ''
    let quote = false
    let bracket = false
    let escape = false

    for (const char of row) {
      if (escape) {
        column += char
        escape = false
      } else if (char === '\\') {
        escape = true
      } else if (char === '"') {
        quote = !quote
      } else if (char === '[') {
        bracket = true
      } else if (char === ']') {
        bracket = false
      } else if (char === ' ' && !quote && !bracket) {
        columns.push(column)
        column = ''
      } else {
        column += char
      }
    }

    if (column) {
      columns.push(column)
    }

    return columns
  }
}
