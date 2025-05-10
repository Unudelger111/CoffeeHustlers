'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch inserted menu items dynamically
    const menuItems = await queryInterface.sequelize.query(
      'SELECT id FROM "MenuItems";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const sizes = [];

    for (const item of menuItems) {
      sizes.push(
        { menu_item_id: item.id, size: 'Small', base_price: 5.00 },
        { menu_item_id: item.id, size: 'Medium', base_price: 6.50 },
        { menu_item_id: item.id, size: 'Large', base_price: 8.00 }
      );
    }

    await queryInterface.bulkInsert('MenuItemSizes', sizes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MenuItemSizes', null, {});
  }
};
