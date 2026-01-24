import path from 'path';

// Railway injects env vars directly, no need for dotenv
// Debug: Log environment variables
console.log('🔑 AUDD_API_KEY present:', !!process.env.AUDD_API_KEY);
console.log('🔑 AUDD_API_KEY value:', process.env.AUDD_API_KEY || 'NOT SET');
console.log('📦 All env vars:', Object.keys(process.env).filter(k => k.includes('AUDD') || k.includes('ALLOWED')));

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'production',

  auddApiKey: process.env.AUDD_API_KEY || '',

  tempAudioPath: process.env.TEMP_AUDIO_PATH || './temp',
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),

  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),

  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
};

export const TEMP_DIR = path.resolve(config.tempAudioPath);
