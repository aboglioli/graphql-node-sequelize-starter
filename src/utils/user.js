const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config');

function getUser(token) {
  return jwt.verify(token, jwtSecret);
}

function generateValidationCode() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return '000000'
    .split('')
    .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join('');
}

module.exports = {
  getUser,
  generateValidationCode,
};
