const db = require('../config/db');

const createUser = async ({ name, email, passwordHash }) => {
  const { rows } = await db.query(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at, updated_at
    `,
    [name, email, passwordHash]
  );

  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await db.query(
    `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await db.query(
    `
      SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
