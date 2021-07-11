import Redis from 'ioredis'

import config from './config.js'

async function main() {

  let r = new Redis()

  // delete the existing index, if it's there
  let indices = await r.call('FT._LIST')
  if (indices.includes(config.HASH_INDEX))
    await r.call('FT.DROPINDEX', config.HASH_INDEX)

  // create the index
  await r.call(
    'FT.CREATE', config.HASH_INDEX,
    'ON', 'hash',
    'PREFIX', 1, `${config.HASH_KEY_PREFIX}:`,
    'SCHEMA',
      'id', 'TAG', 'SORTABLE',
      'title', 'TEXT', 'WEIGHT', 2, 'SORTABLE',
      'timestamp', 'NUMERIC', 'SORTABLE',
      'observed', 'TEXT', 'SORTABLE',
      'location_details', 'TEXT',
      'latitude', 'NUMERIC', 'SORTABLE',
      'longitude', 'NUMERIC', 'SORTABLE',
      'location', 'GEO',
      'county', 'TAG', 'SORTABLE',
      'state', 'TAG', 'SORTABLE',
      'classification', 'TAG', 'SORTABLE',
      'temperature_high', 'NUMERIC', 'SORTABLE',
      'temperature_mid', 'NUMERIC', 'SORTABLE',
      'temperature_low', 'NUMERIC', 'SORTABLE',
      'dew_point', 'NUMERIC', 'SORTABLE',
      'humidity', 'NUMERIC', 'SORTABLE',
      'cloud_cover', 'NUMERIC', 'SORTABLE',
      'moon_phase', 'NUMERIC', 'SORTABLE',
      'precip_intensity', 'NUMERIC', 'SORTABLE',
      'precip_probability', 'NUMERIC', 'SORTABLE',
      'precip_type', 'TAG', 'SORTABLE',
      'pressure', 'NUMERIC', 'SORTABLE',
      'weather_summary', 'TEXT', 'SORTABLE',
      'uv_index', 'NUMERIC', 'SORTABLE',
      'visibility', 'NUMERIC', 'SORTABLE',
      'wind_bearing', 'NUMERIC', 'SORTABLE',
      'wind_speed', 'NUMERIC', 'SORTABLE'
  )

  // all done
  r.quit()
}

main()
