const { request } = require('graphql-request');

const { server, seed, login, makeClient } = require('./helpers');
const pkg = require('../package.json');

describe('Meta', () => {
  let host, client;

  beforeAll(async () => {
    host = await server.start();
  });

  afterAll(() => {
    server.stop();
  });

  beforeEach(async () => {
    await seed.reset();
    await seed.admin();
    const { token } = await login('admin', '123456');
    client = makeClient(host, token);
  });

  test('Retrieve information', async () => {
    const { meta } = await request(
      host,
      `
      {
        meta {
          version
          author
          uptime
        }
      }
    `,
    );
    expect(meta.version).toBe(pkg.version);
    expect(meta.author).toBe(pkg.author);
    expect(meta.uptime.endsWith(' seconds')).toBe(true);
  });
});
