// separate file to be load by sequelize-cli

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
  },
};
