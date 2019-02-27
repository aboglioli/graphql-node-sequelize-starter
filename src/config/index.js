const db = require('./db');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  db,
  redis: {
    development: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    test: {
      mock: true,
    },
    production: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
};
