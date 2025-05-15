'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const franchises = await queryInterface.sequelize.query(
      `SELECT id FROM "Franchises";`
    );
    const franchiseRows = franchises[0];

    const coffeeShops = [];

    // Example owner_id for demo data
    const demoOwnerId = 1; // Replace this with actual user ID (Barista or Manager)

    for (const franchise of franchiseRows) {
      coffeeShops.push(
        {
          franchise_id: franchise.id,
          name: `Central Branch`,
          owner_id: demoOwnerId,
          location: '123 Main Street, Downtown',
          latitude: 47.920000,
          longitude: 106.910000,
          open_status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          franchise_id: franchise.id,
          name: `Mall Outlet`,
          owner_id: demoOwnerId,
          location: '456 Shopping Mall Blvd',
          latitude: 47.915000,
          longitude: 106.900000,
          open_status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          franchise_id: franchise.id,
          name: `Campus Kiosk`,
          owner_id: demoOwnerId,
          location: '789 University Campus Rd',
          latitude: 47.925000,
          longitude: 106.920000,
          open_status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    }

    await queryInterface.bulkInsert('CoffeeShops', coffeeShops, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CoffeeShops', null, {});
  }
};
