const { Joi } = require('express-validation');

module.exports = {
  transactionValidation: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().positive().required(),
      vat: Joi.number().min(0).less(1).required()
    })
  }
};
