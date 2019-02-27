require('dotenv').config();
const { GraphQLClient, request } = require('graphql-request');

// Mock modules
const config = require('../src/config');
if (config.redis.mock) {
  jest.mock('../src/redis', () => require('redis-mock').createClient());
}

const startServer = require('../src/server');
const {
  Mutation: { login },
} = require('../src/resolvers/user.resolvers');

class Server {
  async start() {
    this.app = await startServer();
    const { port } = this.app.address();
    this.host = `http://localhost:${port}`;

    return this.host;
  }

  stop() {
    if (this.app) {
      this.app.close();
      return true;
    }
    return false;
  }

  async login(username, password) {
    if (!this.host) {
      throw new Error('Server not initialized');
    }

    const { token } = await login(null, { username, password });

    this.client = new GraphQLClient(this.host, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return token;
  }

  request(graphql, variables) {
    if (!this.host) {
      throw new Error('Server not initialized');
    }

    return variables
      ? request(this.host, graphql, variables)
      : request(this.host, graphql);
  }
}

module.exports = {
  Server,
  seed: require('./seed'),
  getError: errors => errors && errors[0] && errors[0].message,
};
