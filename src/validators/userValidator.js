import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().max(100).optional(),
  profession: Joi.string().valid('Student', 'Engineer', 'Doctor', 'Other').optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  username: Joi.string().alphanum().min(3).max(30).optional(), // Can be auto-generated
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().optional(),
    github: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    website: Joi.string().uri().optional()
  }).optional(),
  role: Joi.forbidden(), // Users cannot start as admin
  dob: Joi.date().optional(),
  interests: Joi.array().items(Joi.string()).optional()
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
