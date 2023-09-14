export const host = process.env.REDIS_HOST
export const port = Number(process.env.REDIS_PORT)
export const password = process.env.REDIS_PASSWORD

export const keyPrefix = 'bigfoot:sighting'
export const indexName = `${keyPrefix}:index`
