const idSchema = DataTypes => ({
  allowNull: false,
  primaryKey: true,
  unique: true,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
});

module.exports = {
  idSchema,
};
