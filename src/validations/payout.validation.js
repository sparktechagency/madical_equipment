const Joi = require("joi");

const createPayoutValidation = {
  body: Joi.object().keys({
    amount: Joi.number()
      .required()
      .positive()
      .messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be a positive number",
        "any.required": "Amount is required",
      }),
  }),
};



module.exports = {
  createPayoutValidation,
};
