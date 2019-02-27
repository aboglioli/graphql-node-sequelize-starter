const { GraphQLServer } = require('graphql-yoga');
const cors = require('cors');

const schema = require('./modules');
const models = require('./models');
const redis = require('./redis');
const context = require('./context');

const server = new GraphQLServer({
  schema,
  context,
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
