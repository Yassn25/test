const {
  runValidation,
  contactCreateSchema,
  contactUpdateSchema,
} = require('../utils/validators');
const {
  getContactsByUser,
  createContact,
  updateContact,
  deleteContact,
} = require('../models/contactModel');

const listContacts = async (req, res, next) => {
  try {
    const contacts = await getContactsByUser(req.user.id);
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
};

const createContactHandler = async (req, res, next) => {
  try {
    const payload = runValidation(contactCreateSchema, req.body);
    const contact = await createContact(req.user.id, payload);
    res.status(201).json({ contact });
  } catch (error) {
    next(error);
  }
};

const updateContactHandler = async (req, res, next) => {
  try {
    const payload = runValidation(contactUpdateSchema, req.body);
    const contact = await updateContact(req.user.id, req.params.id, payload);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    next(error);
  }
};

const deleteContactHandler = async (req, res, next) => {
  try {
    const deleted = await deleteContact(req.user.id, req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  createContact: createContactHandler,
  updateContact: updateContactHandler,
  deleteContact: deleteContactHandler,
};
