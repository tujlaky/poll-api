const { Joi } = require('express-validation');

module.exports = {
  pollValidation: {
    body: Joi.object({
      title: Joi.string().required(),
      username: Joi.string().required(),
    })
  }
};
