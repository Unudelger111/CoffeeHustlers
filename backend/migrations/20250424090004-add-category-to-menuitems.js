module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MenuItems', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Uncategorized' // optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MenuItems', 'category');
  }
};
