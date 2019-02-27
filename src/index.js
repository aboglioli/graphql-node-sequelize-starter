const startServer = require('./server');

startServer({
  onStart: app => console.log('[SERVER] Running on', app.address()),
  onDB: () => console.log('[DB] Connection has been established'),
  onRedis: () => console.log('[REDIS] Connection has been established'),
});
