import 'dotenv/config'

import chalk from 'chalk'
import csv from 'csv-parser'
import fs from 'fs'
import { SchemaFieldTypes } from 'redis'

import { redis } from './redis.js'
import * as config from './config.js'

// flush the database
await redis.flushAll()

// read the input file and start writing JSON documents
fs.createReadStream('data/bfro_reports_geocoded.csv')
  .pipe(csv())
  .on('data', data => {

    // the CSV data often has empty string where we want undefined, so call
    // a bunch of functions to give us undefined where we want
    const id = toInteger(data.number).toString()
    const title = toTitle(data.title)
    const timestamp = toTimestamp(data.date)
    const observed = data.observed
    const classification = toTag(data.classification)
    const county = toCounty(data.county)
    const state = toTag(data.state)
    const longitude = toFloat(data.longitude)
    const latitude = toFloat(data.latitude)
    const latlng = toGeo(data.longitude, data.latitude)
    const locationDetails = data.location_details
    const dewPoint = toFloat(data.dew_point)
    const humidity = toFloat(data.humidity)
    const cloudCover = toFloat(data.cloud_cover)
    const moonPhase = toFloat(data.moon_phase)
    const pressure = toFloat(data.pressure)
    const summary = data.summary
    const uvIndex = toInteger(data.uv_index)
    const visibility = toFloat(data.visibility)
    const highTemp = toFloat(data.temperature_high)
    const midTemp = toFloat(data.temperature_mid)
    const lowTemp = toFloat(data.temperature_low)
    const precipitationIntensity = toFloat(data.precip_intensity)
    const precipitationProbability = toFloat(data.precip_probability)
    const precipitationType = toTag(data.precip_type)
    const windBearing = toInteger(data.wind_bearing)
    const windSpeed = toFloat(data.wind_speed)

    // create the JavaScript object to store and add fields that have a value
    const json = {}

    json.id = id

    if (hasValue(title)) json.title = title
    if (hasValue(timestamp)) json.timestamp = timestamp
    if (hasValue(observed)) json.observed = observed
    if (hasValue(classification)) json.classification = classification

    json.location = {}
    if (hasValue(county)) json.location.county = county
    if (hasValue(state)) json.location.state = state
    if (hasValue(latitude)) json.location.latitude = latitude
    if (hasValue(longitude)) json.location.longitude = longitude
    if (hasValue(latlng)) json.location.latlng = latlng
    if (hasValue(locationDetails)) json.location.details = locationDetails

    json.weather = {}
    if (hasValue(dewPoint)) json.weather.dewPoint = dewPoint
    if (hasValue(humidity)) json.weather.humidity = humidity
    if (hasValue(cloudCover)) json.weather.cloudCover = cloudCover
    if (hasValue(moonPhase)) json.weather.moonPhase = moonPhase
    if (hasValue(pressure)) json.weather.pressure = pressure
    if (hasValue(summary)) json.weather.summary = summary
    if (hasValue(uvIndex)) json.weather.uvIndex = uvIndex
    if (hasValue(visibility)) json.weather.visibility = visibility

    json.weather.temperature = []
    if (hasValue(lowTemp)) json.weather.temperature.push(lowTemp)
    if (hasValue(midTemp)) json.weather.temperature.push(midTemp)
    if (hasValue(highTemp)) json.weather.temperature.push(highTemp)

    json.weather.precipitation = {}
    if (hasValue(precipitationIntensity)) json.weather.precipitation.intensity = precipitationIntensity
    if (hasValue(precipitationProbability)) json.weather.precipitation.probability = precipitationProbability
    if (hasValue(precipitationType)) json.weather.precipitation.type = precipitationType

    json.weather.wind = {}
    if (hasValue(windBearing)) json.weather.wind.bearing = windBearing
    if (hasValue(windSpeed)) json.weather.wind.speed = windSpeed

    // store the json...
    const key = `${config.keyPrefix}:${id}`
    redis.json.set(key, '$', json)

    // ...and report out
    console.log('👣 Saved sighting to', chalk.red('Redis'), 'at', chalk.green(key))

  }).on('end', async () => {

    // create the index
    await redis.ft.create(
      config.indexName, {

        '$.id': { AS: 'id', type: SchemaFieldTypes.TAG },
        '$.title': { AS: 'title', type: SchemaFieldTypes.TEXT, WEIGHT: 2 },
        '$.timestamp': { AS: 'timestamp', type: SchemaFieldTypes.NUMERIC },
        '$.observed': { AS: 'observed', type: SchemaFieldTypes.TEXT },
        '$.classification': { AS: 'classification', type: SchemaFieldTypes.TAG },

        '$.location.county': { AS: 'county', type: SchemaFieldTypes.TAG },
        '$.location.state': { AS: 'state', type: SchemaFieldTypes.TAG },
        '$.location.latitude': { AS: 'latitude', type: SchemaFieldTypes.NUMERIC },
        '$.location.longitude': { AS: 'longitude', type: SchemaFieldTypes.NUMERIC },
        '$.location.latlng': { AS: 'latlng', type: SchemaFieldTypes.GEO },
        '$.location.details': { AS: 'locationDetails', type: SchemaFieldTypes.TEXT },

        '$.weather.dewPoint': { AS: 'dewPoint', type: SchemaFieldTypes.NUMERIC },
        '$.weather.humidity': { AS: 'humidity', type: SchemaFieldTypes.NUMERIC },
        '$.weather.cloudCover': { AS: 'cloudCover', type: SchemaFieldTypes.NUMERIC },
        '$.weather.moonPhase': { AS: 'moonPhase', type: SchemaFieldTypes.NUMERIC },
        '$.weather.pressure': { AS: 'pressure', type: SchemaFieldTypes.NUMERIC },
        '$.weather.summary': { AS: 'weatherSummary', type: SchemaFieldTypes.TEXT },
        '$.weather.uvIndex': { AS: 'uvIndex', type: SchemaFieldTypes.NUMERIC },
        '$.weather.visibility': { AS: 'visibility', type: SchemaFieldTypes.NUMERIC },

        '$.weather.temperature[*]': { AS: 'temperatures', type: SchemaFieldTypes.NUMERIC },
        '$.weather.temperature[0]': { AS: 'lowTemperature', type: SchemaFieldTypes.NUMERIC },
        '$.weather.temperature[-1:]': { AS: 'highTemperature', type: SchemaFieldTypes.NUMERIC },

        '$.weather.precipitation.intensity': { AS: 'precipitationIntensity', type: SchemaFieldTypes.NUMERIC },
        '$.weather.precipitation.probability': { AS: 'precipitationProbability', type: SchemaFieldTypes.NUMERIC },
        '$.weather.precipitation.type': { AS: 'precipitationType', type: SchemaFieldTypes.TAG },

        '$.wind.bearing': { AS: 'windBearing', type: SchemaFieldTypes.NUMERIC },
        '$.wind.speed': { AS: 'windSpeed', type: SchemaFieldTypes.NUMERIC }

      }, {
        ON: 'JSON',
        PREFIX: config.keyPrefix
      }
    )

    // report out that we created the index
    console.log('✅ Created index', chalk.blue(config.indexName))

    // disconnect from Redis
    await redis.disconnect()
  })

function hasValue(value) {
  return value ?? null !== null
}

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
