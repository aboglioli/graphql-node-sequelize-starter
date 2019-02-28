const { performance } = require('perf_hooks');
const { rule, shield } = require('graphql-shield');

const log = async (resolve, root, args, ctx, info) => {
  const start = performance.now();

  const result = await resolve(root, args, ctx, info);

  const time = performance.now() - start;
  console.log(
    `Request: ${time.toFixed(2)}ms`,
    '-',
    `Result: ${JSON.stringify(result, null, 2)}`,
  );

  return result;
};

const isAuthenticated = rule()((root, args, ctx) => {
  return !!ctx.user || new Error('NOT_AUTHORIZED');
});

const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: isAuthenticated,
    me: isAuthenticated,
  },
});

module.exports = [log, permissions];
