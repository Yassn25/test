const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  listContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactsController');

const router = Router();

router.use(authMiddleware);

router.get('/', listContacts);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
