import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => logger.info('🟢 Connected to Redis'));
redis.on('error', (err) => logger.error('❌ Redis Error:', err));

export default redis;
