'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      MenuItem.belongsTo(models.Franchise, {
        foreignKey: 'franchise_id'
      });
      MenuItem.belongsTo(models.User, {
        foreignKey: 'created_by'
      });
      MenuItem.hasMany(models.MenuItemSize, {
        foreignKey: 'menu_item_id',
        as: 'sizes'
      });
    }
  }

  MenuItem.init({
    franchise_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_status: {
      type: DataTypes.ENUM('Available', 'Out of Stock'),
      allowNull: false,
      defaultValue: 'Available'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Other'
    }
  }, {
    sequelize,
    modelName: 'MenuItem',
    tableName: 'MenuItems',
    underscored: false,
    timestamps: true,
  });

  return MenuItem;
};
