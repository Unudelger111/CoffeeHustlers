'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderDetail.belongsTo(models.MenuItemSize, { foreignKey: 'menu_size_id' });
    }
  }
  OrderDetail.init({
    order_id: DataTypes.INTEGER,
    menu_size_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'OrderDetails',
    underscored: false,
    timestamps: false,
  });
  return OrderDetail;
};
