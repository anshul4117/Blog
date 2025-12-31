import pino from 'pino';
import config from './index.js';

const logger = pino({
  level: config.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      singleLine: false,
      ignore: 'pid,hostname',
    },
  } : undefined,
});

export default logger;
