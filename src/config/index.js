const db = require('./db');
const redis = require('./redis');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  jwtSecret: process.env.JWT_SECRET,
  db: db[env],
  redis: redis[env],
};
