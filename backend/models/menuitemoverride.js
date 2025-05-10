'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItemOverride extends Model {
    static associate(models) {
      MenuItemOverride.belongsTo(models.CoffeeShop, {
        foreignKey: 'coffee_shop_id',
        as: 'coffee_shop'
      });
      MenuItemOverride.belongsTo(models.MenuItem, {
        foreignKey: 'menu_item_id',
        as: 'menu_item'
      });
    }
  }

  MenuItemOverride.init({
    coffee_shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_status: {
      type: DataTypes.ENUM('Available', 'Out of Stock'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MenuItemOverride',
    tableName: 'MenuItemOverrides',
    underscored: false,
    timestamps: false,
  });

  return MenuItemOverride;
};
