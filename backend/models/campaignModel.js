const db = require('../config/db');

const getCampaignsByUser = async (userId) => {
  const { rows } = await db.query(
    `
      SELECT id, user_id, name, channel, status, scheduled_at, created_at, updated_at
      FROM campaigns
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};

const createCampaign = async (
  userId,
  { name, channel, scheduledAt = null, templateId = null, content = null }
) => {
  const { rows } = await db.query(
    `
      INSERT INTO campaigns (user_id, name, channel, status, scheduled_at, template_id, content)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, name, channel, status, scheduled_at, template_id, content, created_at, updated_at
    `,
    [userId, name, channel, 'draft', scheduledAt, templateId, content]
  );

  return rows[0];
};

const updateCampaignStatus = async (userId, campaignId, status) => {
  const { rows } = await db.query(
    `
      UPDATE campaigns
      SET status = $3,
          updated_at = NOW()
      WHERE id = $2 AND user_id = $1
      RETURNING id, user_id, name, channel, status, scheduled_at, template_id, content, created_at, updated_at
    `,
    [userId, campaignId, status]
  );

  return rows[0];
};

const findCampaignById = async (userId, campaignId) => {
  const { rows } = await db.query(
    `
      SELECT id, user_id, name, channel, status, scheduled_at, template_id, content, created_at, updated_at
      FROM campaigns
      WHERE id = $2 AND user_id = $1
      LIMIT 1
    `,
    [userId, campaignId]
  );

  return rows[0];
};

module.exports = {
  getCampaignsByUser,
  createCampaign,
  updateCampaignStatus,
  findCampaignById,
};
