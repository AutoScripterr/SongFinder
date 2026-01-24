import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import songRoutes from './routes/songRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { cleanupService } from './services/cleanup.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', songRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log('🚀 Server running on port', config.port);
  console.log('📝 Environment:', config.nodeEnv);
  console.log('🌐 CORS enabled for:', config.allowedOrigins.join(', '));
  console.log('🔄 Version: 2.0 - Fresh build from GitHub');

  // Start periodic cleanup of old temp files
  cleanupService.startPeriodicCleanup(30, 60);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    // Cleanup all temp files on shutdown
    await cleanupService.cleanupAll();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    // Cleanup all temp files on shutdown
    await cleanupService.cleanupAll();
    process.exit(0);
  });
});

export default app;
