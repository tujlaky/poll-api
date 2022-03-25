const { Joi } = require('express-validation');

module.exports = {
  transactionValidation: {
    body: Joi.object({
      username: Joi.string().required(),
      answer_id: Joi.number().min(0).required()
    })
  }
};
