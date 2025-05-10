/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { Franchise } = require('../models');
const { CoffeeShop } = require('../models');
const { User } = require('../models');
const { MenuItem } = require('../models');
const { MenuItemSize } = require('../models');
const { sequelize } = require('../models');


/**
* Create a new franchise
*
* franchiseCreate FranchiseCreate 
* no response value expected for this operation
*/
const franchisesPOST = ({ franchiseCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const newFranchise = await Franchise.create(franchiseCreate);
      resolve(Service.successResponse(newFranchise));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Update a franchise
*
* id Integer 
* franchiseCreate FranchiseCreate 
* no response value expected for this operation
*/
const franchisesIdPUT = ({ id, franchiseCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const [updated] = await Franchise.update(franchiseCreate, {
        where: { id },
      });
      if (updated) {
        const updatedFranchise = await Franchise.findByPk(id);
        resolve(Service.successResponse(updatedFranchise));
      } else {
        throw new Error('Franchise not found');
      }
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Delete a franchise
*
* id Integer 
* no response value expected for this operation
*/
const franchisesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = await Franchise.destroy({ where: { id } });
      if (deleted) {
        resolve(Service.successResponse({ message: 'Franchise deleted successfully' }));
      } else {
        throw new Error('Franchise not found');
      }
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
 * Create a new coffee shop
 */
const coffee_shopsPOST = ({ coffeeShopCreate }) => new Promise(async (resolve, reject) => {
  try {
    const newShop = await CoffeeShop.create(coffeeShopCreate);
    resolve(Service.successResponse(newShop, 201));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to create coffee shop', e.status || 400));
  }
});

/**
 * Update coffee shop
 */
const coffee_shopsIdPUT = ({ id, coffeeShopCreate }) => new Promise(async (resolve, reject) => {
  try {
    const shop = await CoffeeShop.findByPk(id);
    if (!shop) {
      return reject(Service.rejectResponse('Coffee shop not found', 404));
    }
    await shop.update(coffeeShopCreate);
    resolve(Service.successResponse(shop));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to update coffee shop', e.status || 400));
  }
});

/**
 * Delete coffee shop
 */
const coffee_shopsIdDELETE = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const rowsDeleted = await CoffeeShop.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      return reject(Service.rejectResponse('Coffee shop not found', 404));
    }
    resolve(Service.successResponse(null, 204));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to delete coffee shop', e.status || 500));
  }
});

/**
* Update user profile
*
* id Integer 
* userUpdate UserUpdate 
* no response value expected for this operation
*/
const profileIdPUT = ({ id, userUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Only allow these fields to be updated
      const allowedFields = ['name', 'email', 'phone'];
      const sanitizedUpdate = {};

      for (const key of allowedFields) {
        if (userUpdate[key] !== undefined) {
          sanitizedUpdate[key] = userUpdate[key];
        }
      }

      const [updated] = await User.update(sanitizedUpdate, {
        where: { id },
      });

      if (updated === 0) {
        return reject(Service.rejectResponse('User not found or no changes made', 404));
      }

      const updatedUser = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'phone', 'role', 'createdAt', 'updatedAt'],
      });

      resolve(Service.successResponse(updatedUser));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error updating user profile',
        e.status || 500,
      ));
    }
  },
);

const usersIdRolePUT = ({ id, userRoleUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const { role } = userRoleUpdate;

      if (!role) {
        return reject(Service.rejectResponse('Role is required', 400));
      }

      const [updated] = await User.update(
        { role },
        { where: { id } }
      );

      if (updated === 0) {
        return reject(Service.rejectResponse('User not found or role unchanged', 404));
      }

      const updatedUser = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'phone', 'role', 'createdAt', 'updatedAt'],
      });

      resolve(Service.successResponse(updatedUser));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error updating user role',
        e.status || 500,
      ));
    }
  },
);

/**
* Create a new menu item
*
* menuItemCreate MenuItemCreate 
* returns MenuItem
**/
const menu_itemsPOST = ({ menuItemCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const newItem = await MenuItem.create({
        ...menuItemCreate,
        stock_status: menuItemCreate.stock_status || 'Available'
      });
      resolve(Service.successResponse(newItem));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Error creating menu item', e.status || 500));
    }
  },
);

const menu_itemsIdPUT = ({ id, menuItemUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      await MenuItem.update(menuItemUpdate, {
        where: { id },
      });
      const updated = await MenuItem.findByPk(id);
      resolve(Service.successResponse(updated));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to update menu item', e.status || 500));
    }
  }
);
/**
* Delete menu item
*
*/
const menu_itemsIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    const t = await sequelize.transaction();
    try {
      await MenuItemSize.destroy({
        where: { menu_item_id: id },
        transaction: t,
      });

      await MenuItem.destroy({
        where: { id },
        transaction: t,
      });

      await t.commit();
      resolve(Service.successResponse(null));
    } catch (e) {
      await t.rollback();
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);


const menu_item_sizesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      await MenuItemSize.destroy({ where: { id } });
      resolve(Service.successResponse(null));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to delete size', e.status || 500));
    }
  }
);

const menu_item_sizesIdPUT = ({ id, menuItemSizePut }) => new Promise(
  async (resolve, reject) => {
    try {
      if (!menuItemSizePut?.price) {
        return reject(Service.rejectResponse('Price is required', 400));
      }
      const [updatedCount] = await MenuItemSize.update(
        { base_price: menuItemSizePut.price },
        { where: { id } }
      );
      if (updatedCount === 0) {
        return reject(Service.rejectResponse('Menu item size not found', 404));
      }
      const updated = await MenuItemSize.findByPk(id);
      resolve(Service.successResponse(updated));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Failed to update price', e.status || 500));
    }
  }
);

const menu_itemsIdSizesPOST = ({ id, menuItemSizeCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      const newSize = await MenuItemSize.create({
        menu_item_id: id,
        size: menuItemSizeCreate.size,
        base_price: menuItemSizeCreate.price
      });
      resolve(Service.successResponse(newSize, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Failed to create size',
        e.status || 500
      ));
    }
  }
);


module.exports = {
  coffee_shopsIdDELETE,
  coffee_shopsIdPUT,
  coffee_shopsPOST,
  franchisesIdDELETE,
  franchisesIdPUT,
  franchisesPOST,
  menu_item_sizesIdDELETE,
  menu_itemsIdDELETE,
  profileIdPUT,
  usersIdRolePUT,
  menu_itemsPOST,
  menu_item_sizesIdDELETE,
  menu_item_sizesIdPUT,
  menu_itemsIdPUT,
  menu_itemsIdSizesPOST,
};
