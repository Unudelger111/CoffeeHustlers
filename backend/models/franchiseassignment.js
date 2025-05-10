'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FranchiseAssignment extends Model {
    static associate(models) {
      FranchiseAssignment.belongsTo(models.User, { foreignKey: 'user_id' });
      FranchiseAssignment.belongsTo(models.Franchise, { foreignKey: 'franchise_id' });
    }
  }

  FranchiseAssignment.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    franchise_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Manager'),
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
    modelName: 'FranchiseAssignment',
    tableName: 'FranchiseAssignments',
    underscored: false,
    timestamps: true,
  });

  return FranchiseAssignment;
};
