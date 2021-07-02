import csv from 'csv-parser'
import Redis from 'ioredis'

import fs from 'fs'

import config from './config.js'

let r = new Redis()
let p = r.pipeline()

fs.createReadStream('data/bfro_reports_geocoded.csv')
  .pipe(csv())
  .on('data', data => {

    // the CSV data often has empty string where we want undefined, so call
    // a bunch of functions to give us undefined where we want
    let id = toInteger(data.number)
    let title = toTitle(data.title)
    let date = data.date
    let timestamp = toTimestamp(data.date)
    let observed = data.observed
    let classification = toTag(data.classification)
    let county = toCounty(data.county)
    let state = toTag(data.state)
    let longitude = toFloat(data.longitude)
    let latitude = toFloat(data.latitude)
    let location = toGeo(data.longitude, data.latitude)
    let location_details = data.location_details
    let temperature_high = toFloat(data.temperature_high)
    let temperature_mid = toFloat(data.temperature_mid)
    let temperature_low = toFloat(data.temperature_low)
    let dew_point = toFloat(data.dew_point)
    let humidity = toFloat(data.humidity)
    let cloud_cover = toFloat(data.cloud_cover)
    let moon_phase = toFloat(data.moon_phase)
    let precip_intensity = toFloat(data.precip_intensity)
    let precip_probability = toFloat(data.precip_probability)
    let precip_type = toTag(data.precip_type)
    let pressure = toFloat(data.pressure)
    let summary = data.summary
    let uv_index = toInteger(data.uv_index)
    let visibility = toFloat(data.visibility)
    let wind_bearing = toInteger(data.wind_bearing)
    let wind_speed = toFloat(data.wind_speed)

    // define the Redis key
    let key = `${config.HASH_KEY_PREFIX}:${id}`

    // collate the values to save in a Redis hash
    let values = Object.fromEntries(
      Object
        .entries({
          id, title, date, timestamp, observed, classification, 
          county, state, latitude, longitude, location, location_details,
          temperature_high, temperature_mid, temperature_low,
          dew_point, humidity, cloud_cover, moon_phase,
          precip_intensity, precip_probability, precip_type,
          pressure, summary, uv_index, visibility,
          wind_bearing, wind_speed })
        .filter(entry => entry[1] !== undefined)) // removes empty values

    // write the data to Redis
    p.hset(key, values)

  })
  .on('end', () => {
    p.exec()
    r.quit()
  })
  
function toTitle(value) {
  return value.replace(/^Report \d*: /, '')
}

function toCounty(value) {
  return toTag(value.replace(/ County$/, ''))
}

function toTimestamp(value) {
  return value !== '' ? Math.floor(Date.parse(value) / 1000) : undefined
}

function toTag(value) {
  return value !== '' ? value : undefined 
}

function toGeo(longitude, latitude) {
  return longitude !== '' && latitude !== '' ? `${toFloat(longitude)},${toFloat(latitude)}` : undefined
}

function toInteger(value) {
  return value !== '' ? parseInt(value) : undefined
}

function toFloat(value) {
  return value !== '' ? round(parseFloat(value)) : undefined
}

function round(num) {
  return +(Math.round(num + 'e+5') + 'e-5')
}
