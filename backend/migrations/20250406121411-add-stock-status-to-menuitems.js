'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MenuItems', 'stock_status', {
      type: Sequelize.ENUM('Available', 'Out of Stock'),
      allowNull: false,
      defaultValue: 'Available'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MenuItems', 'stock_status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MenuItems_stock_status";');
  }
};
