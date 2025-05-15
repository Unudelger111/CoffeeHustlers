'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch franchise IDs
    const franchises = await queryInterface.sequelize.query(
      `SELECT id FROM "Franchises";`
    );

    const franchiseRows = franchises[0];

    const menuItems = [];
    const menuItemSizes = [];

    const drinks = [
      // Hot Drinks
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk foam.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cappuchino.png',
        category: 'Hot Drink',
        base_price: 3.50,
      },
      {
        name: 'Latte',
        description: 'Espresso with steamed milk.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/latte.png',
        category: 'Hot Drink',
        base_price: 3.80,
      },
      {
        name: 'Mocha',
        description: 'Chocolate-flavored coffee.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/hot.png',
        category: 'Hot Drink',
        base_price: 4.00,
      },
      {
        name: 'Flat White',
        description: 'Microfoam milk with espresso.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/coffee_img.png',
        category: 'Hot Drink',
        base_price: 3.70,
      },
      {
        name: 'Hot Chocolate',
        description: 'Rich and creamy chocolate.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/hot_choco.png',
        category: 'Hot Drink',
        base_price: 3.50,
      },
      // Cold Drinks
      {
        name: 'Iced Americano',
        description: 'Espresso with cold water and ice.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cold_brew.png',
        category: 'Cold Drink',
        base_price: 3.20,
      },
      {
        name: 'Cold Brew',
        description: 'Slow-steeped cold brew coffee.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cold_brew.png',
        category: 'Cold Drink',
        base_price: 3.80,
      },
      {
        name: 'Iced Latte',
        description: 'Chilled espresso with milk.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/iced_latte.png',
        category: 'Cold Drink',
        base_price: 3.90,
      },
      {
        name: 'Frappuccino',
        description: 'Blended iced coffee drink.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/Frappuccino.png',
        category: 'Cold Drink',
        base_price: 4.50,
      },
      {
        name: 'Iced Mocha',
        description: 'Iced chocolate-flavored coffee.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/iced_mocha.png',
        category: 'Cold Drink',
        base_price: 4.20,
      },
      // Coffee
      {
        name: 'Espresso',
        description: 'Strong coffee shot.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/espresso.png',
        category: 'Coffee',
        base_price: 2.50,
      },
      {
        name: 'Americano',
        description: 'Espresso with hot water.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/americano.png',
        category: 'Coffee',
        base_price: 2.80,
      },
      {
        name: 'Macchiato',
        description: 'Espresso topped with milk foam.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/latte.png',
        category: 'Coffee',
        base_price: 3.00,
      },
      {
        name: 'Cortado',
        description: 'Espresso with equal milk.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/hot.png',
        category: 'Coffee',
        base_price: 3.20,
      },
      {
        name: 'Affogato',
        description: 'Espresso poured over ice cream.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cappuchino.png',
        category: 'Coffee',
        base_price: 4.50,
      },
      // Other
      {
        name: 'Kiwi juice',
        description: 'kiwi juice',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/kiwi_juice.png',
        category: 'Other',
        base_price: 5.00,
      },
      {
        name: 'Chai Latte',
        description: 'Spiced tea concentrate with steamed milk.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/hot.png',
        category: 'Other',
        base_price: 4.20,
      },
      {
        name: 'Herbal Tea',
        description: 'Caffeine-free herbal infusion.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/tea1.png',
        category: 'Other',
        base_price: 3.00,
      },
      {
        name: 'Fruit Smoothie',
        description: 'Blended fruit drink.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/cold.png',
        category: 'Other',
        base_price: 4.50,
      },
      {
        name: 'Mango juice',
        description: 'Refreshing mango juice.',
        image_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/mango.png',
        category: 'Other',
        base_price: 3.50,
      },
    ];

    let menuItemId = 1;

    for (const franchise of franchiseRows) {
      for (const drink of drinks) {
        menuItems.push({
          franchise_id: franchise.id,
          name: drink.name,
          description: drink.description,
          image_url: drink.image_url,
          created_by: 1, // Replace with actual admin user ID
          stock_status: 'Available',
          category: drink.category,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        menuItemSizes.push(
          { menu_item_id: menuItemId, size: 'Small', base_price: drink.base_price },
          { menu_item_id: menuItemId, size: 'Medium', base_price: (drink.base_price + 0.5).toFixed(2) },
          { menu_item_id: menuItemId, size: 'Large', base_price: (drink.base_price + 1.0).toFixed(2) }
        );

        menuItemId++;
      }
    }

    await queryInterface.bulkInsert('MenuItems', menuItems, {});
    await queryInterface.bulkInsert('MenuItemSizes', menuItemSizes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MenuItemSizes', null, {});
    await queryInterface.bulkDelete('MenuItems', null, {});
  }
};
