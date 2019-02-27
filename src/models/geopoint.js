const Sequelize = require('sequelize');

class GeoPoint extends Sequelize.Model {
  static init(sequelize) {
    return super.init(schema, { sequelize });
  }
}

const schema = {
  id: {
    allowNull: false,
    primaryKey: true,
    unique: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
};

module.exports = GeoPoint;
