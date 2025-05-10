'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Franchise extends Model {
    static associate(models) {
      // define association here
    }
  }

  Franchise.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    logo_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Franchise',
    tableName: 'Franchises',
    underscored: false,
    timestamps: true,   
  });

  Franchise.associate = function (models) {
    Franchise.hasMany(models.MenuItem, { foreignKey: 'franchise_id' });
  };  

  return Franchise;
};
