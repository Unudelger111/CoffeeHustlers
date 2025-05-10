'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItemSize extends Model {
    static associate(models) {
      MenuItemSize.belongsTo(models.MenuItem, {
        foreignKey: 'menu_item_id',
        as: 'menu_item'
      });
    }
  }

  MenuItemSize.init({
    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.ENUM('Small', 'Medium', 'Large'),
      allowNull: false
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MenuItemSize',
    tableName: 'MenuItemSizes',
    underscored: true,
    timestamps: false
  });

  return MenuItemSize;
};
