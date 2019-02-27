require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const cors = require('cors');

const models = require('./models');
const resolvers = require('./resolvers');
const redis = require('./redis');
const makeContext = require('./context');

const server = new GraphQLServer({
  typeDefs: './src/typeDefs/index.graphql',
  resolvers,
  context: makeContext,
});

// cors
server.express.use(cors());

module.exports = async ({ onStart, onDB, onRedis } = {}) => {
  // db
  await models.sequelize.authenticate();
  onDB && onDB();

  // redis
  onRedis && redis && redis.connected && onRedis();

  // app
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  onStart && onStart(app);

  return app;
};
