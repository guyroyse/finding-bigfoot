import { createClient } from 'redis'
import * as config from './config.js'

export const redis = createClient({
  socket: {
    host: config.host,
    port: config.port
  },
  password: config.password
})

redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()
