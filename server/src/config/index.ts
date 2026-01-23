import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  auddApiKey: process.env.AUDD_API_KEY || '',

  tempAudioPath: process.env.TEMP_AUDIO_PATH || './temp',
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),

  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),

  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
};

export const TEMP_DIR = path.resolve(config.tempAudioPath);
