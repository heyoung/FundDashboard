import devConfig from './config/db.config.dev.json'

function getConnectionUrl() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI
  }

  return `mongodb://${devConfig.HOST}:${devConfig.PORT}/${devConfig.DB_NAME}`
}

export { getConnectionUrl }
