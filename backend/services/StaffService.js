/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { FranchiseAssignment, StaffAssignment, User, CoffeeShop, Franchise } = require('../models');

// -------------------- Franchise Assignments --------------------

/**
 * Create a new franchise assignment
 */
const franchise_assignmentsPOST = ({ franchiseAssignmentCreate }) => new Promise(async (resolve, reject) => {
  try {
    const created = await FranchiseAssignment.create(franchiseAssignmentCreate);
    resolve(Service.successResponse(created));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to assign franchise manager', 500));
  }
});

/**
 * Get all franchise assignments
 */
const franchise_assignmentsGET = () => new Promise(async (resolve, reject) => {
  try {
    const data = await FranchiseAssignment.findAll({
      include: [User, Franchise]
    });
    resolve(Service.successResponse(data));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch franchise assignments', 500));
  }
});

/**
 * Get one franchise assignment by ID
 */
const franchise_assignmentsIdGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const assignment = await FranchiseAssignment.findByPk(id, {
      include: [User, Franchise]
    });
    if (!assignment) return reject(Service.rejectResponse('Assignment not found', 404));
    resolve(Service.successResponse(assignment));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error fetching assignment', 500));
  }
});

/**
 * Delete franchise assignment by ID
 */
const franchise_assignmentsIdDELETE = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const deleted = await FranchiseAssignment.destroy({ where: { id } });
    if (!deleted) return reject(Service.rejectResponse('Assignment not found', 404));
    resolve(Service.successResponse({ message: 'Assignment deleted successfully' }));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error deleting assignment', 500));
  }
});

const franchise_assignmentsIdPUT = ({ id, franchiseAssignmentUpdate }) => new Promise(async (resolve, reject) => {
  try {
    const assignment = await FranchiseAssignment.findByPk(id);
    if (!assignment) {
      return reject(Service.rejectResponse('Franchise assignment not found', 404));
    }

    // Only allow updating user_id
    await assignment.update({
      user_id: franchiseAssignmentUpdate.user_id
    });

    resolve(Service.successResponse(assignment));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to reassign franchise manager', 500));
  }
});


// -------------------- Staff Assignments --------------------

/**
 * Create a new staff assignment
 */
const staff_assignmentsPOST = ({ staffAssignmentCreate }) => new Promise(async (resolve, reject) => {
  try {
    const created = await StaffAssignment.create(staffAssignmentCreate);
    resolve(Service.successResponse(created));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to assign staff', 500));
  }
});

/**
 * Get all staff assignments
 */
const staff_assignmentsGET = () => new Promise(async (resolve, reject) => {
  try {
    const data = await StaffAssignment.findAll({
      include: [User, CoffeeShop]
    });
    resolve(Service.successResponse(data));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch staff assignments', 500));
  }
});

/**
 * Get one staff assignment by ID
 */
const staff_assignmentsIdGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const assignment = await StaffAssignment.findByPk(id, {
      include: [User, CoffeeShop]
    });
    if (!assignment) return reject(Service.rejectResponse('Assignment not found', 404));
    resolve(Service.successResponse(assignment));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error fetching assignment', 500));
  }
});

/**
 * Delete staff assignment by ID
 */
const staff_assignmentsIdDELETE = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const deleted = await StaffAssignment.destroy({ where: { id } });
    if (!deleted) return reject(Service.rejectResponse('Assignment not found', 404));
    resolve(Service.successResponse({ message: 'Staff assignment deleted successfully' }));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error deleting assignment', 500));
  }
});

/**
 * Get all staff for a specific coffee shop
 */
const coffee_shopsIdStaffGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const staff = await StaffAssignment.findAll({
      where: { coffee_shop_id: id },
      include: [User]
    });
    resolve(Service.successResponse(staff));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error fetching coffee shop staff', 500));
  }
});

/**
 * Get all coffee shops a user is assigned to
 */
const usersIdStaffAssignmentsGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const assignments = await StaffAssignment.findAll({
      where: { user_id: id },
      include: [CoffeeShop]
    });
    resolve(Service.successResponse(assignments));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Error fetching user assignments', 500));
  }
});

const staff_assignmentsIdPUT = ({ id, staffAssignmentUpdate }) => new Promise(async (resolve, reject) => {
  try {
    const assignment = await StaffAssignment.findByPk(id);
    if (!assignment) return reject(Service.rejectResponse('Staff assignment not found', 404));

    await assignment.update(staffAssignmentUpdate);

    resolve(Service.successResponse(assignment));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to update staff assignment', 500));
  }
});


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
