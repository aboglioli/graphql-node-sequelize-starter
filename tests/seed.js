const faker = require('faker');
const { range } = require('lodash');

const models = require('../src/models');

const defaultPassword =
  '$2a$10$vs.5CNkidL9A2fDK2twGU.f2IvACwaAhK6hy8pZgI./uVn8bSRT8S';

module.exports = {
  // raw objects
  defaultPassword,
  newUser: {
    username: 'newUser',
    password: '123456',
    name: 'New User',
    email: 'new-user@new-user.com',
    contact: {
      phone: '2615124578',
      address: 'Address 123',
      geopoint: {
        lat: 123,
        lng: 123,
      },
    },
  },

  // db
  reset: () => models.sequelize.sync({ force: true, logging: false }),
  admin: () =>
    models.User.create({
      username: 'admin',
      password: defaultPassword,
      name: 'Admin',
      email: 'admin@admin.com',
      validated: true,
    }),
  user: (quantity = 1, defaultValues = {}) =>
    Promise.all(
      range(0, quantity).map(() =>
        models.User.create({
          username: faker.internet.userName(),
          password: defaultPassword,
          name: faker.name.firstName(),
          email: faker.internet.email(),
          ...defaultValues,
        }),
      ),
    ),
};
