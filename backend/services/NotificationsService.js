/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { Notification } = require('../models'); // Adjust if model is elsewhere

/**
 * Create a new notification
 */
const notificationsPOST = ({ notificationCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const notification = await Notification.create(notificationCreate);
      resolve(Service.successResponse(notification, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to create notification', e.status || 500));
    }
  },
);

/**
 * Get user notifications (optionally unread)
 */
const usersUserIdNotificationsGET = ({ userId, unread }) => new Promise(
  async (resolve, reject) => {
    try {
      const whereClause = { user_id: userId };
      if (unread === true || unread === 'true') {
        whereClause.is_read = false;
      }
      const notifications = await Notification.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });
      resolve(Service.successResponse(notifications));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to fetch notifications', e.status || 500));
    }
  },
);

/**
 * Mark a single notification as read
 */
const notificationsIdReadPATCH = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        return reject(Service.rejectResponse('Notification not found', 404));
      }
      notification.is_read = true;
      await notification.save();
      resolve(Service.successResponse(notification));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to update notification', e.status || 500));
    }
  },
);

/**
 * Mark all notifications as read for a user
 */
const usersUserIdNotificationsReadAllPATCH = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      await Notification.update(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
      );
      resolve(Service.successResponse({ message: 'All notifications marked as read' }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to update notifications', e.status || 500));
    }
  },
);

/**
 * Delete a notification
 */
const notificationsIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = await Notification.destroy({ where: { id } });
      if (deleted === 0) {
        return reject(Service.rejectResponse('Notification not found', 404));
      }
      resolve(Service.successResponse({ message: 'Notification deleted' }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to delete notification', e.status || 500));
    }
  },
);

module.exports = {
  notificationsPOST,
  usersUserIdNotificationsGET,
  notificationsIdReadPATCH,
  usersUserIdNotificationsReadAllPATCH,
  notificationsIdDELETE,
};
