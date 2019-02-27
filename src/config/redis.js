module.exports = {
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
};
