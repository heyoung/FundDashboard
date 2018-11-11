import devConfig from './config/db.config.dev.json'
import prodConfig from './config/db.config.prod.json'

function getConnectionUrl() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI
  }

  if (process.env.NODE_ENV === 'prod') {
    return `mongodb://${prodConfig.USERNAME}:${prodConfig.PASSWORD}@${
      prodConfig.HOST
    }:${prodConfig.PORT}/${prodConfig.DB_NAME}`
  }

  return `mongodb://${devConfig.HOST}:${devConfig.PORT}/${devConfig.DB_NAME}`
}

export { getConnectionUrl }
