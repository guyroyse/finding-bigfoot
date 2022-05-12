import { createClient, SchemaFieldTypes } from 'redis'
import * as config from './config.js'

// connect to redis at localhost:6379
const client = createClient()
client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()

// delete the existing index, if it's there
const indices = await client.ft._list()
if (indices.includes(config.HASH_INDEX))
  await client.ft.dropIndex(config.HASH_INDEX)

// create the index
await client.ft.create(
  config.HASH_INDEX, {
    id: { type: SchemaFieldTypes.TAG, sortable: true },
    title: { type: SchemaFieldTypes.TEXT, WEIGHT: 2, sortable: true },
    timestamp: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    observed: { type: SchemaFieldTypes.TEXT, sortable: true },
    location_details: { type: SchemaFieldTypes.TEXT, sortable: true },
    latitude: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    longitude: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    location: { type: SchemaFieldTypes.GEO },
    county: { type: SchemaFieldTypes.TAG, sortable: true },
    state: { type: SchemaFieldTypes.TAG, sortable: true },
    classification: { type: SchemaFieldTypes.TAG, sortable: true },
    temperature_high: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    temperature_mid: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    temperature_low: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    dew_point: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    humidity: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    cloud_cover: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    moon_phase: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    precip_intensity: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    precip_probability: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    precip_type: { type: SchemaFieldTypes.TAG, sortable: true },
    pressure: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    weather_summary: { type: SchemaFieldTypes.TEXT, sortable: true },
    uv_index: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    visibility: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    wind_bearing: { type: SchemaFieldTypes.NUMERIC, sortable: true },
    wind_speed: { type: SchemaFieldTypes.NUMERIC, sortable: true },
  }, {
    ON: 'HASH',
    PREFIX: `${config.HASH_KEY_PREFIX}:`
  }
)

// all done
await client.quit()
