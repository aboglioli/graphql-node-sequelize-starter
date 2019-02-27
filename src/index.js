require('dotenv').config();

const startServer = require('./server');
const models = require('./models');

(async () => {
  await startServer({
    onStart: app => console.log('[SERVER] Running on', app.address()),
    onDB: () => console.log('[DB] Connection has been established'),
    onRedis: () => console.log('[REDIS] Connection has been established'),
  });

  await models.sequelize.sync();
})();
