import { createClient, SchemaFieldTypes } from 'redis'
import * as config from './config.js'

// connect to redis at localhost:6379
const client = createClient()
client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()

// delete the existing index, if it's there
const indices = await client.ft._list()
if (indices.includes(config.JSON_INDEX))
  await client.ft.dropIndex(config.JSON_INDEX)

// create the index
await client.ft.create(
  config.JSON_INDEX, {
    '$.id': { AS: 'id', type: SchemaFieldTypes.TAG, sortable: true },
    '$.title': { AS: 'title', type: SchemaFieldTypes.TEXT, WEIGHT: 2, sortable: true },
    '$.timestamp': { AS: 'timestamp', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.observed': { AS: 'observed', type: SchemaFieldTypes.TEXT, sortable: true },
    '$.location_details': { AS: 'location_details', type: SchemaFieldTypes.TEXT, sortable: true },
    '$.latitude': { AS: 'latitude', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.longitude': { AS: 'longitude', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.location': { AS: 'location', type: SchemaFieldTypes.GEO },
    '$.county': { AS: 'county', type: SchemaFieldTypes.TAG, sortable: true },
    '$.state': { AS: 'state', type: SchemaFieldTypes.TAG, sortable: true },
    '$.classification': { AS: 'classification', type: SchemaFieldTypes.TAG, sortable: true },
    '$.temperature_high': { AS: 'temperature_high', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.temperature_mid': { AS: 'temperature_mid', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.temperature_low': { AS: 'temperature_low', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.dew_point': { AS: 'dew_point', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.humidity': { AS: 'humidity', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.cloud_cover': { AS: 'cloud_cover', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.moon_phase': { AS: 'moon_phase', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.precip_intensity': { AS: 'precip_intensity', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.precip_probability': { AS: 'precip_probability', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.precip_type': { AS: 'precip_type', type: SchemaFieldTypes.TAG, sortable: true },
    '$.pressure': { AS: 'pressure', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.weather_summary': { AS: 'weather_summary', type: SchemaFieldTypes.TEXT, sortable: true },
    '$.uv_index': { AS: 'uv_index', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.visibility': { AS: 'visibility', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.wind_bearing': { AS: 'wind_bearing', type: SchemaFieldTypes.NUMERIC, sortable: true },
    '$.wind_speed': { AS: 'wind_speed', type: SchemaFieldTypes.NUMERIC, sortable: true },
  }, {
    ON: 'JSON',
    PREFIX: `${config.JSON_KEY_PREFIX}:`
  }
)

// all done
await client.quit()
