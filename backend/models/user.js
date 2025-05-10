'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.MenuItem, { foreignKey: 'created_by' });
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.CoffeeShop, { foreignKey: 'owner_id' });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("Customer", "Barista", "Manager", "Admin"),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: false,
    timestamps: true,
  });

  return User;
};
