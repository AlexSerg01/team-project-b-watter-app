import Joi from 'joi';

export const addAmountOfConsumedWaterSchema = Joi.object({
  amount: Joi.number().integer().positive().max(5000).required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

export const updateAmountOfConsumedWaterSchema = Joi.object({
  amount: Joi.number().integer().positive().max(5000).required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
});
