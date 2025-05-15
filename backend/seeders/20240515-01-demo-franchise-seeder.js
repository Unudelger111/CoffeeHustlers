'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Franchises', [
      {
        name: 'Tom n Toms',
        description: 'Premium coffee and baked goods chain known for its large cafes.',
        logo_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/tt_logo.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coffee Namu',
        description: 'Local artisanal coffee shop known for its cozy atmosphere and specialty brews.',
        logo_url: 'https://my-coffee-app-images.s3.ap-northeast-2.amazonaws.com/namu.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Franchises', null, {});
  },
};