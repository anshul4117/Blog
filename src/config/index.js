import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 2000,
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME || 'blogdb',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // External Services
  MAIL_SERVICE: process.env.MAIL_SERVICE || 'gmail',
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};

// Validation: Check required variables at startup
const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
requiredVars.forEach(varName => {
  if (!config[varName] && config.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Freeze config to prevent modifications at runtime
export default Object.freeze(config);
