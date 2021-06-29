import csv from 'csv-parser'
import Redis from 'ioredis'

import fs from 'fs'

let r = new Redis()
let p = r.pipeline()

fs.createReadStream('data/bfro_reports_geocoded.csv')
  .pipe(csv())
  .on('data', data => {

    let {
      number, title, date, observed, classification,
      county, state, latitude, longitude, location_details,
      temperature_high, temperature_mid, temperature_low,
      dew_point, humidity, cloud_cover, moon_phase,
      precip_intensity, precip_probability, precip_type,
      pressure, summary, uv_index, visibility,
      wind_bearing, wind_speed
    } = data

    let id = parseInt(number)
    title = title.replace(/^Report \d*: /, '')
    county = county.replace(/ County$/, '')
    let location = (longitude && latitude) ? `${longitude},${latitude}` : ''

    let key = `sighting:${id}`
    let values = Object.fromEntries(
      Object.entries({
        id, title, date, observed, classification, 
        county, state, latitude, longitude, location, location_details,
        temperature_high, temperature_mid, temperature_low,
        dew_point, humidity, cloud_cover, moon_phase,
        precip_intensity, precip_probability, precip_type,
        pressure, summary, uv_index, visibility,
        wind_bearing, wind_speed
      }).filter(entry => entry[1] !== ''))

    p.hset(key, values)
  })
  .on('end', () => {
    p.exec()
    r.quit()
  })