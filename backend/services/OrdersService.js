/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { Order, OrderDetail, MenuItemSize, MenuItem, CoffeeShop, User } = require('../models');

const coffee_shopsIdOrdersGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const orders = await Order.findAll({
        where: { shop_id: id },
        include: [{ model: User, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
      });
      resolve(Service.successResponse(orders));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: MenuItemSize,
                include: [{ model: MenuItem, as: 'menu_item' }]
              }
            ]
          }
        ]
      });
      if (!order) return reject(Service.rejectResponse('Order not found', 404));
      resolve(Service.successResponse(order));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersIdItemsItemIdDELETE = ({ id, itemId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = await OrderDetail.destroy({
        where: { order_id: id, id: itemId }
      });
      if (deleted === 0) return reject(Service.rejectResponse('Item not found in order', 404));
      resolve(Service.successResponse({ message: 'Item removed' }));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersIdItemsPOST = ({ id, orderDetailCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const newItem = await OrderDetail.create({
        ...orderDetailCreate,
        order_id: id
      });
      resolve(Service.successResponse(newItem));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersIdStatusGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const order = await Order.findByPk(id, {
        attributes: ['id', 'order_status']
      });
      if (!order) return reject(Service.rejectResponse('Order not found', 404));
      resolve(Service.successResponse(order));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersPOST = ({ orderCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const order = await Order.create({
        user_id: orderCreate.user_id,
        shop_id: orderCreate.shop_id,
        order_status: "Pending",
        order_time: new Date(),
        pickup_time: orderCreate.pickup_time,
        status_updated_at: new Date()
      });

      resolve(Service.successResponse({
        id: order.id,
        message: 'Order created'
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);


const usersIdOrdersGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const orders = await Order.findAll({
        where: { user_id: id },
        order: [['createdAt', 'DESC']],
      });
      resolve(Service.successResponse(orders));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

const ordersIdStatusPUT = ({ id, orderStatusUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const order = await Order.findByPk(id);
      if (!order) return reject(Service.rejectResponse('Order not found', 404));
      await order.update({
        order_status: orderStatusUpdate.order_status,
        status_updated_at: new Date()
      });
      resolve(Service.successResponse({ message: 'Order status updated' }));
    } catch (e) {
      reject(Service.rejectResponse(e.message, e.status || 500));
    }
  },
);

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
