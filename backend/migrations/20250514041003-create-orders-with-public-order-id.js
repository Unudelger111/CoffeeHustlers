'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      shop_id: {
        type: Sequelize.INTEGER
      },
      order_status: {
        type: Sequelize.ENUM('Pending', 'Preparing', 'Ready', 'Completed')
      },
      order_time: {
        type: Sequelize.DATE
      },
      pickup_time: {
        type: Sequelize.DATE
      },
      status_updated_at: {
        type: Sequelize.DATE
      },
      public_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};
