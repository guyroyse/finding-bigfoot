import Redis from 'ioredis'

import config from './config.js'

async function main() {

  let r = new Redis()

  // delete the existing index, if it's there
  let indices = await r.call('FT._LIST')
  if (indices.includes(config.JSON_INDEX))
    await r.call('FT.DROPINDEX', config.JSON_INDEX)

  // create the index
  await r.call(
    'FT.CREATE', config.JSON_INDEX,
    'ON', 'json',
    'PREFIX', 1, `${config.JSON_KEY_PREFIX}:`,
    'SCHEMA',
      '$.id', 'AS', 'id', 'TAG', 'SORTABLE',
      '$.title', 'AS', 'title', 'TEXT', 'SORTABLE',
      '$.timestamp', 'AS', 'timestamp', 'NUMERIC', 'SORTABLE',
      '$.observed', 'AS', 'observed', 'TEXT', 'SORTABLE',
      '$.location_details', 'AS', 'location_details', 'TEXT',
      '$.latitude', 'AS', 'latitude', 'NUMERIC', 'SORTABLE',
      '$.longitude', 'AS', 'longitude', 'NUMERIC', 'SORTABLE',
      '$.location', 'AS', 'location', 'GEO',
      '$.county', 'AS', 'county', 'TAG', 'SORTABLE',
      '$.state', 'AS', 'state', 'TAG', 'SORTABLE',
      '$.classification', 'AS', 'classification', 'TAG', 'SORTABLE',
      '$.temperature_high', 'AS', 'temperature_high', 'NUMERIC', 'SORTABLE',
      '$.temperature_mid', 'AS', 'temperature_mid', 'NUMERIC', 'SORTABLE',
      '$.temperature_low', 'AS', 'temperature_low', 'NUMERIC', 'SORTABLE',
      '$.dew_point', 'AS', 'dew_point', 'NUMERIC', 'SORTABLE',
      '$.humidity', 'AS', 'humidity', 'NUMERIC', 'SORTABLE',
      '$.cloud_cover', 'AS', 'cloud_cover', 'NUMERIC', 'SORTABLE',
      '$.moon_phase', 'AS', 'moon_phase', 'NUMERIC', 'SORTABLE',
      '$.precip_intensity', 'AS', 'precip_intensity', 'NUMERIC', 'SORTABLE',
      '$.precip_probability', 'AS', 'precip_probability', 'NUMERIC', 'SORTABLE',
      '$.precip_type', 'AS', 'precip_type', 'TAG', 'SORTABLE',
      '$.pressure', 'AS', 'pressure', 'NUMERIC', 'SORTABLE',
      '$.weather_summary', 'AS', 'weather_summary', 'TEXT', 'SORTABLE',
      '$.uv_index', 'AS', 'uv_index', 'NUMERIC', 'SORTABLE',
      '$.visibility', 'AS', 'visibility', 'NUMERIC', 'SORTABLE',
      '$.wind_bearing', 'AS', 'wind_bearing', 'NUMERIC', 'SORTABLE',
      '$.wind_speed', 'AS', 'wind_speed', 'NUMERIC', 'SORTABLE'
  )

  // all done
  r.quit()
}

main()
