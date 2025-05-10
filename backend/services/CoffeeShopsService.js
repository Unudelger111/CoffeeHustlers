/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { CoffeeShop } = require('../models');

/**
 * Get all coffee shops
 */
const coffee_shopsGET = () => new Promise(async (resolve, reject) => {
  try {
    const coffeeShops = await CoffeeShop.findAll();
    resolve(Service.successResponse(coffeeShops));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch coffee shops', e.status || 500));
  }
});
/**
 * Get coffee shop by ID
 */
const coffee_shopsIdGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const shop = await CoffeeShop.findByPk(id);
    if (!shop) {
      return reject(Service.rejectResponse('Coffee shop not found', 404));
    }
    resolve(Service.successResponse(shop));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch coffee shop', e.status || 500));
  }
});

module.exports = {
  coffee_shopsGET,
  coffee_shopsIdGET,
};
