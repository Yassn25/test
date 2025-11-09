const {
  runValidation,
  campaignCreateSchema,
  campaignStatusSchema,
} = require('../utils/validators');
const {
  getCampaignsByUser,
  createCampaign,
  updateCampaignStatus,
  findCampaignById,
} = require('../models/campaignModel');

const listCampaigns = async (req, res, next) => {
  try {
    const campaigns = await getCampaignsByUser(req.user.id);
    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
};

const createCampaignHandler = async (req, res, next) => {
  try {
    const payload = runValidation(campaignCreateSchema, req.body);
    const campaign = await createCampaign(req.user.id, payload);
    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
};

const updateCampaignStatusHandler = async (req, res, next) => {
  try {
    const payload = runValidation(campaignStatusSchema, req.body);
    const campaign = await updateCampaignStatus(req.user.id, req.params.id, payload.status);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

const getCampaignHandler = async (req, res, next) => {
  try {
    const campaign = await findCampaignById(req.user.id, req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCampaigns,
  createCampaign: createCampaignHandler,
  updateCampaignStatus: updateCampaignStatusHandler,
  getCampaign: getCampaignHandler,
};
