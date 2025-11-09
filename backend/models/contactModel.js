const db = require('../config/db');

const getContactsByUser = async (userId) => {
  const { rows } = await db.query(
    `
      SELECT id, user_id, first_name, last_name, email, phone, tags, created_at, updated_at
      FROM contacts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};

const createContact = async (userId, { firstName, lastName, email, phone, tags = [] }) => {
  const { rows } = await db.query(
    `
      INSERT INTO contacts (user_id, first_name, last_name, email, phone, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, first_name, last_name, email, phone, tags, created_at, updated_at
    `,
    [userId, firstName, lastName, email, phone, tags]
  );

  return rows[0];
};

const updateContact = async (
  userId,
  contactId,
  { firstName, lastName, email, phone, tags = [] }
) => {
  const { rows } = await db.query(
    `
      UPDATE contacts
      SET
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        email = COALESCE($5, email),
        phone = COALESCE($6, phone),
        tags = COALESCE($7, tags),
        updated_at = NOW()
      WHERE id = $2 AND user_id = $1
      RETURNING id, user_id, first_name, last_name, email, phone, tags, created_at, updated_at
    `,
    [userId, contactId, firstName, lastName, email, phone, tags]
  );

  return rows[0];
};

const deleteContact = async (userId, contactId) => {
  const { rowCount } = await db.query(
    `
      DELETE FROM contacts
      WHERE id = $2 AND user_id = $1
    `,
    [userId, contactId]
  );

  return rowCount > 0;
};

module.exports = {
  getContactsByUser,
  createContact,
  updateContact,
  deleteContact,
};
