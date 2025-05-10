/**
 * The StaffController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/StaffService');

// Franchise Assignments
const franchise_assignmentsPOST = async (req, res) => {
  await Controller.handleRequest(req, res, service.franchise_assignmentsPOST);
};

const franchise_assignmentsGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.franchise_assignmentsGET);
};

const franchise_assignmentsIdGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.franchise_assignmentsIdGET);
};

const franchise_assignmentsIdDELETE = async (req, res) => {
  await Controller.handleRequest(req, res, service.franchise_assignmentsIdDELETE);
};

const franchise_assignmentsIdPUT = async (req, res) => {
  await Controller.handleRequest(req, res, service.franchise_assignmentsIdPUT);
};

// Staff Assignments
const staff_assignmentsPOST = async (req, res) => {
  await Controller.handleRequest(req, res, service.staff_assignmentsPOST);
};

const staff_assignmentsGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.staff_assignmentsGET);
};

const staff_assignmentsIdGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.staff_assignmentsIdGET);
};

const staff_assignmentsIdDELETE = async (req, res) => {
  await Controller.handleRequest(req, res, service.staff_assignmentsIdDELETE);
};

const coffee_shopsIdStaffGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.coffee_shopsIdStaffGET);
};

const usersIdStaffAssignmentsGET = async (req, res) => {
  await Controller.handleRequest(req, res, service.usersIdStaffAssignmentsGET);
};

const staff_assignmentsIdPUT = async (req, res) => {
  await Controller.handleRequest(req, res, service.staff_assignmentsIdPUT);
};

module.exports = {
  franchise_assignmentsPOST,
  franchise_assignmentsGET,
  franchise_assignmentsIdGET,
  franchise_assignmentsIdDELETE,
  staff_assignmentsPOST,
  staff_assignmentsGET,
  staff_assignmentsIdGET,
  staff_assignmentsIdDELETE,
  coffee_shopsIdStaffGET,
  usersIdStaffAssignmentsGET,
  franchise_assignmentsIdPUT,
  staff_assignmentsIdPUT,
};
