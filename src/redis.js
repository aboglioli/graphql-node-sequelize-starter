const redis = require('redis');

const { redis: config } = require('./config');

module.exports = redis.createClient(config.port, config.host);
