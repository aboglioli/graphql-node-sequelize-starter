const Sequelize = require('sequelize');

class GeoPoint extends Sequelize.Model {

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

module.exports = sequelize => {
  GeoPoint.init(schema, { sequelize });
  return GeoPoint;
};
