'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      // Coffee Category
      { franchise_id: 1, name: 'Espresso', description: 'Strong black coffee', image_url: 'https://example.com/espresso.jpg', created_by: 1, stock_status: 'Available', category: 'Coffee', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Americano', description: 'Espresso with hot water', image_url: 'https://example.com/americano.jpg', created_by: 1, stock_status: 'Available', category: 'Coffee', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Latte', description: 'Espresso with steamed milk', image_url: 'https://example.com/latte.jpg', created_by: 1, stock_status: 'Available', category: 'Coffee', createdAt: new Date(), updatedAt: new Date() },

      // Hot Drink Category
      { franchise_id: 1, name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate', image_url: 'https://example.com/hotchocolate.jpg', created_by: 1, stock_status: 'Available', category: 'Hot Drink', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Chai Tea', description: 'Spiced tea with milk', image_url: 'https://example.com/chai.jpg', created_by: 1, stock_status: 'Available', category: 'Hot Drink', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Matcha Latte', description: 'Green tea with steamed milk', image_url: 'https://example.com/matcha.jpg', created_by: 1, stock_status: 'Available', category: 'Hot Drink', createdAt: new Date(), updatedAt: new Date() },

      // Cold Drink Category
      { franchise_id: 1, name: 'Iced Americano', description: 'Chilled espresso with water', image_url: 'https://example.com/icedamericano.jpg', created_by: 1, stock_status: 'Available', category: 'Cold Drink', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Iced Latte', description: 'Cold milk with espresso', image_url: 'https://example.com/icedlatte.jpg', created_by: 1, stock_status: 'Available', category: 'Cold Drink', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Cold Brew', description: 'Smooth cold brewed coffee', image_url: 'https://example.com/coldbrew.jpg', created_by: 1, stock_status: 'Available', category: 'Cold Drink', createdAt: new Date(), updatedAt: new Date() },

      // Other Category
      { franchise_id: 1, name: 'Smoothie', description: 'Fruit blended drink', image_url: 'https://example.com/smoothie.jpg', created_by: 1, stock_status: 'Available', category: 'Other', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Lemonade', description: 'Fresh lemonade', image_url: 'https://example.com/lemonade.jpg', created_by: 1, stock_status: 'Available', category: 'Other', createdAt: new Date(), updatedAt: new Date() },
      { franchise_id: 1, name: 'Herbal Tea', description: 'Caffeine-free herbal infusion', image_url: 'https://example.com/herbaltea.jpg', created_by: 1, stock_status: 'Available', category: 'Other', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('MenuItems', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MenuItems', null, {});
  }
};
