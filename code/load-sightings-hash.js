import csv from 'csv-parser'
import { createClient } from 'redis'
import fs from 'fs'
import * as config from './config.js'

// connect to redis at localhost:6379
const client = createClient()
client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()

fs.createReadStream('data/bfro_reports_geocoded.csv')
  .pipe(csv())
  .on('data', data => {

    // the CSV data often has empty string where we want undefined, so call
    // a bunch of functions to give us undefined where we want
    const id = toInteger(data.number)
    const title = toTitle(data.title)
    const date = data.date
    const timestamp = toTimestamp(data.date)
    const observed = data.observed
    const classification = toTag(data.classification)
    const county = toCounty(data.county)
    const state = toTag(data.state)
    const longitude = toFloat(data.longitude)
    const latitude = toFloat(data.latitude)
    const location = toGeo(data.longitude, data.latitude)
    const location_details = data.location_details
    const temperature_high = toFloat(data.temperature_high)
    const temperature_mid = toFloat(data.temperature_mid)
    const temperature_low = toFloat(data.temperature_low)
    const dew_point = toFloat(data.dew_point)
    const humidity = toFloat(data.humidity)
    const cloud_cover = toFloat(data.cloud_cover)
    const moon_phase = toFloat(data.moon_phase)
    const precip_intensity = toFloat(data.precip_intensity)
    const precip_probability = toFloat(data.precip_probability)
    const precip_type = toTag(data.precip_type)
    const pressure = toFloat(data.pressure)
    const summary = data.summary
    const uv_index = toInteger(data.uv_index)
    const visibility = toFloat(data.visibility)
    const wind_bearing = toInteger(data.wind_bearing)
    const wind_speed = toFloat(data.wind_speed)

    // define the Redis key
    const key = `${config.HASH_KEY_PREFIX}:${id}`

    // collate the values to save in a Redis hash
    const values = Object.fromEntries(
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
    client.hSet(key, values)

  })
  .on('end', () => {
    client.quit()
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
