/**
 * The NotificationsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/NotificationsService');

const notificationsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.notificationsPOST);
};

const usersUserIdNotificationsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersUserIdNotificationsGET);
};

const notificationsIdReadPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.notificationsIdReadPATCH);
};

const usersUserIdNotificationsReadAllPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.usersUserIdNotificationsReadAllPATCH);
};

const notificationsIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.notificationsIdDELETE);
};

module.exports = {
  notificationsPOST,
  usersUserIdNotificationsGET,
  notificationsIdReadPATCH,
  usersUserIdNotificationsReadAllPATCH,
  notificationsIdDELETE,
};
