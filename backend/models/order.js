'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.CoffeeShop, { foreignKey: 'shop_id' });
      Order.hasMany(models.OrderDetail, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    shop_id: DataTypes.INTEGER,
    order_status: DataTypes.ENUM('Pending', 'Preparing', 'Ready', 'Completed'),
    order_time: DataTypes.DATE,
    pickup_time: DataTypes.DATE,
    status_updated_at: DataTypes.DATE,
    public_order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: false,
    timestamps: true,
  });
  return Order;
};