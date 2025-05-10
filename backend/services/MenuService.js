/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { MenuItemOverride, MenuItemSize, CoffeeShop, MenuItem } = require('../models');

/**
 * Create a menu item override for a specific coffee shop
 * POST /coffee-shops/{id}/menu-overrides
 */
const coffee_shopsIdMenuOverridesPOST = ({ id, menuItemOverrideCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const override = await MenuItemOverride.create({
        coffee_shop_id: id,
        menu_item_id: menuItemOverrideCreate.menu_item_id,
        stock_status: menuItemOverrideCreate.stock_status
      });

      resolve(Service.successResponse(override));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Failed to create menu item override',
        e.status || 500,
      ));
    }
  },
);


/**
 * DELETE a menu item override by ID
 * DELETE /menu-overrides/{id}
 */
const menu_overridesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = await MenuItemOverride.destroy({ where: { id } });

      if (!deleted) {
        return reject(Service.rejectResponse('Override not found', 404));
      }

      resolve(Service.successResponse({ message: 'Override deleted successfully' }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error deleting override',
        e.status || 500,
      ));
    }
  },
);

/**
 * UPDATE a menu item override by ID
 * PUT /menu-overrides/{id}
 */
const menu_overridesIdPUT = ({ id, menuItemOverrideUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const [updatedCount, updatedRows] = await MenuItemOverride.update({
        stock_status: menuItemOverrideUpdate.stock_status
      }, {
        where: { id },
        returning: true,
      });

      if (updatedCount === 0) {
        return reject(Service.rejectResponse('Override not found', 404));
      }

      resolve(Service.successResponse(updatedRows[0]));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error updating override',
        e.status || 500,
      ));
    }
  },
);


/**
 * GET one menu item override by ID
 * GET /menu-overrides/{id}
 */
const menu_overridesIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const override = await MenuItemOverride.findByPk(id, {
        include: [
          {
            model: MenuItem,
            as: 'menu_item',
          },
          {
            model: CoffeeShop,
            as: 'coffee_shop',
          },
        ],
      });

      if (!override) {
        return reject(Service.rejectResponse('Override not found', 404));
      }

      resolve(Service.successResponse(override));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error fetching override',
        e.status || 500,
      ));
    }
  },
);

/**
* Get full menu of a coffee shop
*
* id Integer 
* no response value expected for this operation
* */
const coffee_shopsIdMenuGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Step 0: Get the franchise ID for this coffee shop
      const coffeeShop = await CoffeeShop.findByPk(id);
      if (!coffeeShop) {
        return reject(Service.rejectResponse('Coffee shop not found', 404));
      }

      const franchiseId = coffeeShop.franchise_id;

      // Step 1: Fetch only menu items for the same franchise
      const items = await MenuItem.findAll({
        where: {
          stock_status: 'Available',
          franchise_id: franchiseId
        },
      });

      // Step 2: Fetch overrides for this coffee shop
      const overrides = await MenuItemOverride.findAll({
        where: { coffee_shop_id: id },
        attributes: ['menu_item_id', 'stock_status']
      });

      // Step 3: Map overrides for fast lookup
      const overrideMap = new Map();
      overrides.forEach(override => {
        overrideMap.set(override.menu_item_id, override.stock_status);
      });

      // Step 4: Apply overrides logic
      const filteredItems = items.filter(item => {
        const overrideStatus = overrideMap.get(item.id);
        return overrideStatus !== 'Out of Stock'; // only exclude if explicitly out of stock
      });

      resolve(Service.successResponse(filteredItems));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Failed to load menu',
        e.status || 500
      ));
    }
  }
);


const menu_itemsIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const menuItem = await MenuItem.findByPk(id, {
        include: [{
          model: MenuItemSize,
          as: 'sizes'  // 🔧 match the alias defined in MenuItem.hasMany()
        }]
      });

      if (!menuItem) {
        return reject(Service.rejectResponse('Menu item not found', 404));
      }

      resolve(Service.successResponse(menuItem));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error fetching menu item',
        e.status || 500,
      ));
    }
  },
);

module.exports = {
  coffee_shopsIdMenuGET,
  menu_itemsIdGET,
  coffee_shopsIdMenuOverridesPOST,
  menu_overridesIdDELETE,
  menu_overridesIdPUT,
  menu_overridesIdGET,
};
