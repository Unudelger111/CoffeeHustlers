'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderDetails', 'createdAt');
    await queryInterface.removeColumn('OrderDetails', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderDetails', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('OrderDetails', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  }
};
