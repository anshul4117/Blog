import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  APP_URL: Joi.string().default('http://localhost:5000'),
  CLIENT_URL: Joi.string().default('http://localhost:3000'),

  // Database
  MONGO_URI: Joi.string().required().description('MongoDB Connection URL'),
  DB_NAME: Joi.string().default('blogdb'),

  // Redis
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // JWT - Critical Security Keys
  JWT_SECRET: Joi.string().required().min(32).description('JWT Signing Secret'),
  JWT_EXPIRY: Joi.string().default('7d'),

  // Logging
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),

  // External Services
  MAIL_SERVICE: Joi.string().default('gmail'),
  MAIL_USER: Joi.string().email().optional(),
  MAIL_PASS: Joi.string().optional(),
}).unknown(); // Allow other unknown env vars

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  // Application
  env: envVars.NODE_ENV,
  NODE_ENV: envVars.NODE_ENV, // Alias for legacy support
  PORT: envVars.PORT,
  APP_URL: envVars.APP_URL,
  CLIENT_URL: envVars.CLIENT_URL,

  // Database
  MONGO_URI: envVars.MONGO_URI,
  DB_NAME: envVars.DB_NAME,

  // Redis
  REDIS_URL: envVars.REDIS_URL,

  // JWT
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRY: envVars.JWT_EXPIRY,

  // Logging
  LOG_LEVEL: envVars.LOG_LEVEL,

  // Email
  MAIL_SERVICE: envVars.MAIL_SERVICE,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASS: envVars.MAIL_PASS,

  // Nested helpers for new code
  jwt: {
    expiry: envVars.JWT_EXPIRY
  }
};

export default Object.freeze(config);
