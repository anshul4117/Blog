import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().max(100).optional(),
    profession: Joi.string().valid('Student', 'Engineer', 'Doctor', 'Other').optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    dob: Joi.date().optional(),
    interests: Joi.array().items(Joi.string()).optional()
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
