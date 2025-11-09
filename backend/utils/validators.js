const Joi = require('joi');

const runValidation = (schema, payload) => {
  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    const validationError = new Error(message);
    validationError.status = 400;
    throw validationError;
  }

  return value;
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const contactCreateSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).allow('', null),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
});

const contactUpdateSchema = Joi.object({
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100).allow('', null),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  tags: Joi.array().items(Joi.string().max(50)),
}).min(1);

const campaignCreateSchema = Joi.object({
  name: Joi.string().max(150).required(),
  channel: Joi.string().valid('sms', 'email', 'whatsapp').required(),
  scheduledAt: Joi.date().iso().optional(),
  templateId: Joi.string().optional(),
  content: Joi.string().allow('', null),
});

const campaignStatusSchema = Joi.object({
  status: Joi.string().valid('draft', 'scheduled', 'sending', 'sent', 'failed').required(),
});

module.exports = {
  runValidation,
  registerSchema,
  loginSchema,
  contactCreateSchema,
  contactUpdateSchema,
  campaignCreateSchema,
  campaignStatusSchema,
};
