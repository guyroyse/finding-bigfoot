import Redis from 'ioredis'

const INDEX = 'sightings:index'

async function main() {

  let r = new Redis()

  let indices = await r.call('FT._LIST')

  if (indices.includes(INDEX)) {
    await r.call('FT.DROPINDEX', INDEX)
  }
  
  await r.call(
    'FT.CREATE', INDEX,
    'ON', 'hash',
    'PREFIX', 1, 'sighting:',
    'SCHEMA',
      'title', 'TEXT',
      'observed', 'TEXT',
      'location_details', 'TEXT',
      'latitude', 'NUMERIC',
      'longitude', 'NUMERIC',
      'location', 'GEO',
      'county', 'TAG',
      'state', 'TAG',
      'classification', 'TAG',
      'temperature_high', 'NUMERIC',
      'temperature_mid', 'NUMERIC',
      'temperature_low', 'NUMERIC',
      'dew_point', 'NUMERIC',
      'humidity', 'NUMERIC',
      'cloud_cover', 'NUMERIC',
      'moon_phase', 'NUMERIC',
      'precip_intensity', 'NUMERIC',
      'precip_probability', 'NUMERIC',
      'precip_type', 'TAG',
      'pressure', 'NUMERIC',
      'weather_summary', 'TEXT',
      'uv_index', 'NUMERIC',
      'visibility', 'NUMERIC',
      'wind_bearing', 'TAG',
      'wind_speed', 'NUMERIC'
  )

  r.quit()
}

main()
