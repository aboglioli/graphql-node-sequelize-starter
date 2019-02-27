const { createContext, EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize');
const { resolver } = require('graphql-sequelize');

const models = require('./models');
const { getUser } = require('./utils/user');

// Tell `graphql-sequelize` where to find the DataLoader context in the global
// request context
resolver.contextTopOptions = { [EXPECTED_OPTIONS_KEY]: EXPECTED_OPTIONS_KEY };

module.exports = req => {
  // For each request, create a Dataloader context for Sequelize
  const dataloaderContext = createContext(models.sequelize);

  let ctx = {
    [EXPECTED_OPTIONS_KEY]: dataloaderContext,
  };

  const authorization = req.request && req.request.get('Authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    const user = getUser(token);
    ctx = {
      ...ctx,
      token,
      user,
    };
  }

  return ctx;
};
