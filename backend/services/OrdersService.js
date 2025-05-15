/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { Order, OrderDetail, MenuItemSize, MenuItem, CoffeeShop, User, Sequelize  } = require('../models');
const { Op } = Sequelize;

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
      // 1. Get CoffeeShop
      const coffeeShop = await CoffeeShop.findByPk(orderCreate.shop_id);
      if (!coffeeShop) {
        console.error(`CoffeeShop with ID ${orderCreate.shop_id} not found.`);
        return reject(Service.rejectResponse('Coffee shop not found', 404));
      }

      console.log(`CoffeeShop found: ${JSON.stringify(coffeeShop.toJSON())}`);

      // 2. Generate public_order_id components
      const franchiseIdStr = String(coffeeShop.franchise_id).padStart(3, '0');
      const shopIdStr = String(orderCreate.shop_id).padStart(2, '0');
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');

      console.log(`Generated IDs: franchiseId=${franchiseIdStr}, shopId=${shopIdStr}, date=${dateStr}`);

      // 3. Find latest order for this shop+date
      const latestOrder = await Order.findOne({
        where: {
          shop_id: orderCreate.shop_id,
          public_order_id: { [Op.like]: `${franchiseIdStr}-${shopIdStr}-${dateStr}-%` }
        },
        order: [['createdAt', 'DESC']],
        attributes: ['public_order_id']
      });

      console.log(`Latest order: ${latestOrder ? latestOrder.public_order_id : 'None'}`);

      // 4. Calculate next sequence
      let nextSequence = 1;
      if (latestOrder && latestOrder.public_order_id) {
        const match = latestOrder.public_order_id.match(/-(\d+)-\d+$/);
        console.log(`Match result: ${match}`);
        if (match) nextSequence = parseInt(match[1], 10) + 1;
      }

      const sequenceStr = String(nextSequence).padStart(3, '0');
      const randomDigits = Math.floor(100 + Math.random() * 900);
      const publicOrderId = `${franchiseIdStr}-${shopIdStr}-${dateStr}-${sequenceStr}-${randomDigits}`;

      console.log(`Final public_order_id: ${publicOrderId}`);

      // 5. Create Order
      const order = await Order.create({
        user_id: orderCreate.user_id,
        shop_id: orderCreate.shop_id,
        order_status: "Pending",
        order_time: new Date(),
        pickup_time: orderCreate.pickup_time,
        status_updated_at: new Date(),
        public_order_id: publicOrderId
      });

      console.log(`Order created successfully: ID = ${order.id}`);

      resolve(Service.successResponse({
        id: order.id,
        public_order_id: publicOrderId,
        message: 'Order created'
      }));

    } catch (e) {
      console.error('Error creating order:', e);
      reject(Service.rejectResponse(e.message, e.status || 500));
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
