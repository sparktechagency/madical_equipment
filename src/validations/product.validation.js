const Joi = require('joi');
const { objectId } = require('./custom.validation'); // optional if you use custom ObjectId validation

const createProductValidation = {
  body: Joi.object().keys({
    category: Joi.string().required().custom(objectId),
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    date: Joi.date(),
  }),
};


const updateProductValidation = {
    body: Joi.object().keys({
      category: Joi.string().custom(objectId),
      title: Joi.string().optional(),
      price: Joi.number().min(0).optional(),
      description: Joi.string().optional(),
      date: Joi.date().optional(),
    }),
  };

  
  module.exports = {
    createProductValidation,
    updateProductValidation
  }