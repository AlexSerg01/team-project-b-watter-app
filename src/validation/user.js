import Joi from 'joi';

export const userUpdateValidationSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(64),
});


