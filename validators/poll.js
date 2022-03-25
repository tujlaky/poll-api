const { Joi } = require('express-validation');

module.exports = {
  transactionValidation: {
    body: Joi.object({
      title: Joi.string().required(),
      username: Joi.string().required(),
    })
  }
};
