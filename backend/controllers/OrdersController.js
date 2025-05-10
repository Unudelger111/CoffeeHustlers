/**
 * The OrdersController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/OrdersService');
const coffee_shopsIdOrdersGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdOrdersGET);
};

const ordersIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersIdGET);
};

const ordersIdItemsItemIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersIdItemsItemIdDELETE);
};

const ordersIdItemsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersIdItemsPOST);
};

const ordersIdStatusGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersIdStatusGET);
};

const ordersPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersPOST);
};

const usersIdOrdersGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdOrdersGET);
};
const ordersIdStatusPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.ordersIdStatusPUT);
};

module.exports = {
  coffee_shopsIdOrdersGET,
  ordersIdGET,
  ordersIdItemsItemIdDELETE,
  ordersIdItemsPOST,
  ordersIdStatusGET,
  ordersPOST,
  usersIdOrdersGET,
  ordersIdStatusPUT,
};
