'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: Sequelize.STRING,
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Roles');
  },
};
