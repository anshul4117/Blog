import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import logger from './config/logger.js';
import config from './config/index.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true,
    })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
    });
    next();
});

// Routes
import authRoute from './routes/auth.js';
import blogRoute from './routes/blog.js';



app.use('/api/v1.2/users', authRoute);
app.use('/api/v1.2/blogs', blogRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
    });
});

// Test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            code: err.code || 'INTERNAL_ERROR',
            timestamp: new Date().toISOString(),
        },
    });
});

export default app;