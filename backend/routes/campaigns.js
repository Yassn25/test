const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  listCampaigns,
  createCampaign,
  getCampaign,
  updateCampaignStatus,
} = require('../controllers/campaignsController');

const router = Router();

router.use(authMiddleware);

router.get('/', listCampaigns);
router.post('/', createCampaign);
router.get('/:id', getCampaign);
router.patch('/:id/status', updateCampaignStatus);

module.exports = router;
