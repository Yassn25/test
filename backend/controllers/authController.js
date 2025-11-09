const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/token');
const {
  runValidation,
  registerSchema,
  loginSchema,
} = require('../utils/validators');
const { createUser, findUserByEmail } = require('../models/userModel');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const register = async (req, res, next) => {
  try {
    const payload = runValidation(registerSchema, req.body);

    const existingUser = await findUserByEmail(payload.email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await createUser({
      name: payload.name,
      email: payload.email,
      passwordHash,
    });

    const token = generateAccessToken(user.id);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = runValidation(loginSchema, req.body);

    const user = await findUserByEmail(payload.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAccessToken(user.id);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  me,
};
