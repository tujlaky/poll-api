const { Joi } = require('express-validation');

module.exports = {
  answerValidation: {
    body: Joi.object({
      title: Joi.string().required(),
      poll_id: Joi.number().min(0).required()
    })
  }
};
