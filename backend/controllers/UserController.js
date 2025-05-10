/**
 * The UserController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UserService');
const loginPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.loginPOST);
};

const logoutPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.logoutPOST);
};

const profileIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.profileIdGET);
};

const registerPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.registerPOST);
};

const getUsersByEmail = async (req, res) => {
  await Controller.handleRequest(req, res, service.getUsersByEmail);
};


module.exports = {
  loginPOST,
  logoutPOST,
  profileIdGET,
  registerPOST,
  getUsersByEmail,
};
