'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffAssignment extends Model {
    static associate(models) {
      StaffAssignment.belongsTo(models.User, { foreignKey: 'user_id' });
      StaffAssignment.belongsTo(models.CoffeeShop, { foreignKey: 'coffee_shop_id' });
    }
  }

  StaffAssignment.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coffee_shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Barista', 'Manager'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'StaffAssignment',
    tableName: 'StaffAssignments',
    underscored: false,
    timestamps: true,
  });

  return StaffAssignment;
};
