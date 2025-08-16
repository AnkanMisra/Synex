import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { llmRouter } from './routes/llm';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/llm', llmRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Synex Backend started on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT
  });

  // Debug-level logging for configuration (only in development)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Configuration loaded', {
      openRouterBaseUrl: process.env.OPENROUTER_BASE_URL ? '[CONFIGURED]' : '[NOT SET]',
      defaultModel: process.env.DEFAULT_MODEL ? '[CONFIGURED]' : '[NOT SET]'
    });
  }
});

export default app;
