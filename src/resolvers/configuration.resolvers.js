const Configuration = require('../utils/configuration');

module.exports = {
  Query: {
    getConfiguration(root, { key }, ctx) {
      if (!ctx.user) {
        throw new Error('USER_NOT_LOGGED_IN');
      }

      return Configuration.get(ctx.user.id, key);
    },
  },
  Mutation: {
    setConfiguration(root, { key, value }, ctx) {
      if (!ctx.user) {
        throw new Error('USER_NOT_LOGGED_IN');
      }

      return Configuration.set(ctx.user.id, key, value);
    },
  },
};
