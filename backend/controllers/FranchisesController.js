/**
 * The FranchisesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/FranchisesService');
const franchisesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesGET);
};

const franchisesIdCoffee_shopsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesIdCoffee_shopsGET);
};

const franchisesIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesIdGET);
};


module.exports = {
  franchisesGET,
  franchisesIdCoffee_shopsGET,
  franchisesIdGET,
};
