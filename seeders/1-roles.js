'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 'ADMIN',
        name: 'Administrador',
      },
      {
        id: 'USER',
        name: 'Usuario',
      },
    ]);
  },
  down: queryInterface => {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
