'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CoffeeShop extends Model {
    static associate(models) {
      CoffeeShop.belongsTo(models.Franchise, {
        foreignKey: 'franchise_id',
        as: 'franchise'
      });
      CoffeeShop.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'owner'
      });
      CoffeeShop.hasMany(models.Order, {
        foreignKey: 'shop_id'
      });
    }
  }

  CoffeeShop.init({
    franchise_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    open_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'CoffeeShop',
    tableName: 'CoffeeShops',
    underscored: false,
    timestamps: true,
  });

  return CoffeeShop;
};
