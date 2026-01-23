import { Router } from 'express';
import { songController } from '../controllers/songController.js';
import { validateUrl } from '../middleware/validateUrl.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => songController.health(req, res));

// Song identification endpoint with validation and rate limiting
router.post('/identify', rateLimiter, validateUrl, (req, res) => songController.identify(req, res));

export default router;
