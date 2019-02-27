const { GraphQLClient } = require('graphql-request');

const startServer = require('../src/server');
const {
  Mutation: { login },
} = require('../src/resolvers/user.resolvers');

let app;

module.exports = {
  server: {
    start: async () => {
      app = await startServer();
      const { port } = app.address();

      return `http://localhost:${port}`;
    },
    stop: () => app && app.close(),
  },
  redis: require('../src/redis'),
  seed: require('./seed'),
  login: (username, password) => login(null, { username, password }),
  getError: errors => errors && errors[0] && errors[0].message,
  makeClient: (host, token) =>
    new GraphQLClient(host, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
