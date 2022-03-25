const { Joi } = require('express-validation');

module.exports = {
  transactionValidation: {
    body: Joi.object({
      title: Joi.string().required(),
      poll_id: Joi.number().min(0).required()
    })
  }
};
