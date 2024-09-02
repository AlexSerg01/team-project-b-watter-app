import Joi from 'joi';

export const registrationValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
