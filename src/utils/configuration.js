const redis = require('../redis');

const get = (userId, key) =>
  new Promise(resolve => {
    redis.get(`configuration:${userId}:${key}`, (_, value) => {
      resolve(value);
    });
  });

const set = (userId, key, value) =>
  new Promise(resolve => {
    redis.set(`configuration:${userId}:${key}`, value, () => resolve());
  });

module.exports = {
  get,
  set,
};
