const redis = require('redis');
const redisMock = require('redis-mock');

const { redis: config } = require('./config');

module.exports = config.mock
  ? redisMock.createClient()
  : redis.createClient(config.port, config.host);
