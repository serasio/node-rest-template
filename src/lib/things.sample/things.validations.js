const Joi = require('@hapi/joi');

const create = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .required(),
  category_id: Joi.number().required(),
});

module.exports = {
  create,
};
