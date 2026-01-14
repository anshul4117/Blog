import express from 'express';
import { pinoHttp } from 'pino-http';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { mongoSanitize } from './middleware/cleanMongo.js';
import logger from './config/logger.js';
import config from './config/index.js';
import AppError from './utils/AppError.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use('/api', generalLimiter);

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

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Request logging middleware
app.use(pinoHttp({ logger }));

// Routes
import authRoute from './routes/auth.js';
import blogRoute from './routes/blog.js';



import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;