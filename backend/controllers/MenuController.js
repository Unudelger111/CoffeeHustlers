/**
 * The MenuController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/MenuService');

const coffee_shopsIdMenuGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdMenuGET);
};

const menu_itemsIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_itemsIdGET);
};

const coffee_shopsIdMenuOverridesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdMenuOverridesPOST);
};

const menu_overridesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_overridesIdDELETE);
};

const menu_overridesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_overridesIdPUT);
};

const menu_overridesIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_overridesIdGET);
};

module.exports = {
  coffee_shopsIdMenuGET,
  menu_itemsIdGET,
  coffee_shopsIdMenuOverridesPOST,
  menu_overridesIdDELETE,
  menu_overridesIdPUT,
  menu_overridesIdGET,
};
