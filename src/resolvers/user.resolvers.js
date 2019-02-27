const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { resolver } = require('graphql-sequelize');

const models = require('../models');
const config = require('../config');
const redis = require('../redis');
const { generateValidationCode } = require('../utils/user');

module.exports = {
  Query: {
    users: resolver(models.User, {
      before(findOptions, args, ctx) {
        if (!ctx.user) {
          throw new Error('USER_IS_NOT_LOGGED_IN');
        }

        return findOptions;
      },
    }),
    user: resolver(models.User),
    me: resolver(models.User, {
      before(findOptions, args, ctx) {
        if (!ctx.user) {
          throw new Error('USER_IS_NOT_LOGGED_IN');
        }

        findOptions.where = {
          id: ctx.user.id,
        };
        return findOptions;
      },
    }),
  },
  Mutation: {
    async signup(root, { data }) {
      const password = await bcrypt.hash(data.password, 10);

      const existingUsername = await models.User.count({
        where: { username: data.username },
      });
      if (existingUsername) {
        throw new Error('USER_EXISTS');
      }

      const existingEmail = await models.User.count({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new Error('EMAIL_EXISTS');
      }

      const user = await models.User.create(
        {
          ...data,
          password,
        },
        {
          include: [
            {
              association: models.User.Contact,
              include: [models.Contact.GeoPoint],
            },
          ],
        },
      );

      const code = generateValidationCode();
      redis.set(`user:validation:${user.id}`, code);

      return user;
    },
    async login(root, { username, password }) {
      const user = await models.User.findOne({
        where: { username },
      });
      if (!user) {
        throw new Error('USER_DOES_NOT_EXIST');
      }

      if (!user.active) {
        throw new Error('USER_IS_NOT_ACTIVE');
      }

      if (!user.validated) {
        throw new Error('USER_IS_NOT_VALIDATED');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('INVALID_PASSWORD');
      }

      const { id, role } = user;
      const token = jwt.sign({ id, username, role }, config.jwtSecret);

      return {
        user,
        token,
      };
    },
  },
  AuthPayload: {
    user({ user }) {
      return models.User.findOne({ where: { id: user.id } });
    },
  },
};
