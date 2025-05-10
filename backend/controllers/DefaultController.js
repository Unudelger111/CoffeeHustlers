/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DefaultService');

const coffee_shopsIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdDELETE);
};

const coffee_shopsIdMenuPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdMenuPOST);
};

const coffee_shopsIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsIdPUT);
};

const coffee_shopsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.coffee_shopsPOST);
};

const franchisesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesIdDELETE);
};

const franchisesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesIdPUT);
};

const franchisesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.franchisesPOST);
};

const menu_item_sizesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_item_sizesIdDELETE);
};

const menu_itemsIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_itemsIdDELETE);
};

const usersIdRolePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersIdRolePUT);
};

const profileIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.profileIdPUT);
};

const menu_itemsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_itemsPOST);
};

const menu_item_sizesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_item_sizesIdPUT);
};

const menu_itemsIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_itemsIdPUT);
};

const menu_itemsIdSizesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.menu_itemsIdSizesPOST);
};

module.exports = {
  coffee_shopsIdDELETE,
  coffee_shopsIdMenuPOST, // Added
  coffee_shopsIdPUT,
  coffee_shopsPOST,
  franchisesIdDELETE,
  franchisesIdPUT,
  franchisesPOST,
  menu_item_sizesIdDELETE, // Removed duplicate
  menu_itemsIdDELETE,
  profileIdPUT,
  menu_itemsPOST,
  menu_item_sizesIdPUT,
  menu_itemsIdPUT,
  menu_itemsIdSizesPOST,
  usersIdRolePUT,
};