'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: uuid(),
          username: 'admin',
          password:
            '$2a$10$vs.5CNkidL9A2fDK2twGU.f2IvACwaAhK6hy8pZgI./uVn8bSRT8S',
          name: 'Admin',
          email: 'admin@admin.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 'ADMIN',
        },
      ],
      {},
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  },
};
