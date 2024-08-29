import Joi from 'joi';

export const addAmountOfConsumedWaterSchema = Joi.object({
  amount: Joi.number().integer().positive().max(5000).required(),
});
