import { query } from '#pruvious/server'
import { Reader, type ReaderModel } from '@maxmind/geoip2-node'

let _reader: ReaderModel | undefined

async function reader() {
  if (!_reader) {
    const { geoipDb } = await query('settings').select({ geoipDb: true }).populate().read()

    if (geoipDb) {
      _reader = await Reader.open('.uploads/' + geoipDb.directory + geoipDb.filename)
    }
  }

  return _reader
}

/**
 * Get the country and city from an IP address using the GeoLite2 database.
 *
 * @example
 * ```typescript
 * const { country, city } = getLocation('8.8.8.8')
 * console.log(country, '-', city) // United States - Mountain View
 * ```
 */
export async function getLocation(ip: string): Promise<{ country: string; city: string }> {
  const r = await reader()

  if (r) {
    const { country, city } = r.city(ip)
    return { country: country?.names.en ?? 'Unknown', city: city?.names.en ?? 'Unknown' }
  }

  return { country: 'Unknown', city: 'Unknown' }
}
