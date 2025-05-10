const config = require('../config/config');
const { User } = require('../models');
const Service = require('./Service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

const loginPOST = ({ userLogin }) => new Promise(async (resolve, reject) => {
  try {
    if (!userLogin) {
      return reject(Service.rejectResponse('Request body is missing', 400));
    }
    const { email, password } = userLogin;

    if (!email || !password) {
      return reject(Service.rejectResponse('Email and password are required', 400));
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return reject(Service.rejectResponse('Invalid email or password', 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reject(Service.rejectResponse('Invalid email or password', 401));
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '3h',
    });

    resolve(Service.successResponse({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    }));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Login failed', e.status || 500));
  }
});


const logoutPOST = () => new Promise(async (resolve, reject) => {
  try {
    resolve(Service.successResponse({ message: 'Logout successful' }));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Logout failed', e.status || 500));
  }
});

const profileIdGET = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return reject(Service.rejectResponse('User not found', 404));
    }
    resolve(Service.successResponse(user));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch user', e.status || 500));
  }
});

const registerPOST = ({ userRegister }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🧾 userRegister:', userRegister);

      const { name, email, password, role, phone } = userRegister;

      if (!password) throw new Error('Password is required');

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
      });

      resolve(Service.successResponse(user, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Failed to register user',
        e.status || 500,
      ));
    }
  }
);

const getUsersByEmail = ({ email }) => new Promise(async (resolve, reject) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return reject(Service.rejectResponse('User not found', 404));
    }

    resolve(Service.successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    }));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Failed to fetch user', e.status || 500));
  }
});

module.exports = {
  loginPOST,
  logoutPOST,
  profileIdGET,
  registerPOST,
  getUsersByEmail,
};
