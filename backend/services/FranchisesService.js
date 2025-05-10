/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { Franchise } = require('../models');
const { CoffeeShop } = require('../models');

/**
* Get all franchises
*
* returns list of franchises
*/
const franchisesGET = () => new Promise(
  async (resolve, reject) => {
    try {
      const franchises = await Franchise.findAll();
      resolve(Service.successResponse(franchises));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Get coffee shops under a franchise
*
* id Integer 
* no response value expected for this operation
*/
const franchisesIdCoffee_shopsGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const coffeeShops = await CoffeeShop.findAll({
        where: { franchise_id: id }
      });

      resolve(Service.successResponse(coffeeShops));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error fetching coffee shops for franchise',
        e.status || 500
      ));
    }
  },
);

/**
* Get a specific franchise
*
* id Integer 
* returns franchise details
*/
const franchisesIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const franchise = await Franchise.findByPk(id);
      if (!franchise) throw new Error('Franchise not found');
      resolve(Service.successResponse(franchise));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  franchisesGET,
  franchisesIdCoffee_shopsGET,
  franchisesIdGET,
};
