import { describe, expect, it } from 'vitest'
import { Parser } from '~/utils/Parser'

describe('parser', () => {
  it('parses os name', () => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36)',
    ]

    expect(Parser.getOSName(userAgents[0])).toBe('Windows')
    expect(Parser.getOSName(userAgents[1])).toBe('Linux')
    expect(Parser.getOSName(userAgents[2])).toBe('macOS')
  })

  it('parses timestamp', () => {
    expect(Parser.getTimestamp('10/Dec/2020:00:00:00 +0000')).toBe(1607558400000)
    expect(Parser.getTimestamp('19/Jan/2024:10:54:19 +0000')).toBe(1705661659000)
  })

  it('parses example.log', () => {
    const parser = new Parser('test/example.log')
    const row1 = parser.parseRow(1)
    const row2 = parser.parseRow(2)
    const row3 = parser.parseRow(3)
    const row4 = parser.parseRow(4)
    const row5 = parser.parseRow(5)
    const row6 = parser.parseRow(6)
    const row7 = parser.parseRow(7)
    const row8 = parser.parseRow(8)
    const row9 = parser.parseRow(9)

    expect(row1).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'Linux',
      time: 1705661659000,
    })

    expect(row2).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'Linux',
      time: 1705661660000,
    })

    expect(row3).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /tutorial HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/tutorial',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'Linux',
      time: 1705661660000,
    })

    expect(row4).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /api/pages/docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'Linux',
      time: 1705757691000,
    })

    expect(row5).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'Linux',
      time: 1705757691000,
    })

    expect(row6).toEqual({
      visitorId: expect.any(String),
      ip: '1.1.1.1',
      request: 'GET /docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'macOS',
      time: 1705757691000,
    })

    expect(row7).toEqual({
      visitorId: expect.any(String),
      ip: '2.2.2.2',
      request: 'GET /api/pages/docs HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'macOS',
      time: 1705757693000,
    })

    expect(row8).toEqual({
      visitorId: expect.any(String),
      ip: '2.2.2.2',
      request: 'GET /uploads/image.png HTTP/2.0',
      status: 200,
      referrer: 'https://pruvious.com/docs',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      os: 'macOS',
      time: 1705757693000,
    })

    expect(row9).toBe(null)

    expect(row1!.visitorId).toBe(row2!.visitorId)
    expect(row1!.visitorId).toBe(row3!.visitorId)
    expect(row1!.visitorId).toBe(row4!.visitorId)
    expect(row1!.visitorId).toBe(row5!.visitorId)
    expect(row1!.visitorId).not.toBe(row6!.visitorId)
    expect(row1!.visitorId).not.toBe(row7!.visitorId)
    expect(row6!.visitorId).not.toBe(row7!.visitorId)
  })
})
