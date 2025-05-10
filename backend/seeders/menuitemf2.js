'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const baseImageUrls = {
      'Coffee': 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/coffee_img.png',
      'Hot Drink': 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/hot.png',
      'Cold Drink': 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cold.png',
      'Other': 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cake.png',
    };

    const items = [
      { name: 'Espresso', description: 'Strong black coffee', category: 'Coffee' },
      { name: 'Americano', description: 'Espresso with hot water', category: 'Coffee' },
      { name: 'Latte', description: 'Espresso with steamed milk', category: 'Coffee' },

      { name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate', category: 'Hot Drink' },
      { name: 'Chai Tea', description: 'Spiced tea with milk', category: 'Hot Drink' },
      { name: 'Matcha Latte', description: 'Green tea with steamed milk', category: 'Hot Drink' },

      { name: 'Iced Americano', description: 'Chilled espresso with water', category: 'Cold Drink' },
      { name: 'Iced Latte', description: 'Cold milk with espresso', category: 'Cold Drink' },
      { name: 'Cold Brew', description: 'Smooth cold brewed coffee', category: 'Cold Drink' },

      { name: 'Smoothie', description: 'Fruit blended drink', category: 'Other' },
      { name: 'Lemonade', description: 'Fresh lemonade', category: 'Other' },
      { name: 'Herbal Tea', description: 'Caffeine-free herbal infusion', category: 'Other' },
    ].map(item => ({
      franchise_id: 2,
      name: item.name,
      description: item.description,
      image_url: baseImageUrls[item.category],
      created_by: 1,
      stock_status: 'Available',
      category: item.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('MenuItems', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MenuItems', null, {});
  }
};
