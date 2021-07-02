import csv from 'csv-parser'
import Redis from 'ioredis'

import fs from 'fs'

import config from './config.js'

let r = new Redis()
let p = r.pipeline()

fs.createReadStream('data/bfro_reports_geocoded.csv')
  .pipe(csv())
  .on('data', data => {

    // extract fields from CSV data
    let { number, title, date, observed, classification,
          county, state, latitude, longitude, location_details,
          temperature_high, temperature_mid, temperature_low,
          dew_point, humidity, cloud_cover, moon_phase,
          precip_intensity, precip_probability, precip_type,
          pressure, summary, uv_index, visibility,
          wind_bearing, wind_speed } = data

    // transform some of the fields
    let id = parseInt(number)
    title = title.replace(/^Report \d*: /, '')
    county = county.replace(/ County$/, '')
    let location = (longitude && latitude) ? `${longitude},${latitude}` : ''
    let timestamp = date ? Math.floor(Date.parse(date) / 1000) : '' // milliseconds to seconds
    
    // define the Redis key
    let key = `${config.JSON_KEY_PREFIX}:${id}`

    // create the JSON to store
    let json = JSON.stringify(
      Object.fromEntries(
        Object
          .entries({
            id, title, date, timestamp, observed, classification, 
            county, state, latitude, longitude, location, location_details,
            temperature_high, temperature_mid, temperature_low,
            dew_point, humidity, cloud_cover, moon_phase,
            precip_intensity, precip_probability, precip_type,
            pressure, summary, uv_index, visibility,
            wind_bearing, wind_speed })
          .filter(entry => entry[1] !== ''))) // removes empty values

    // write the data to Redis
    p.call('JSON.SET', key, '.', json)

  })
  .on('end', () => {
    p.exec()
    r.quit()
  })