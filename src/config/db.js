import mongoose from 'mongoose';
import config from './index.js';
import logger from './logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        logger.info('MongoDB connected', {
            host: conn.connection.host,
            port: conn.connection.port,
        });
    } catch (err) {
        logger.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export { connectDB };