import type { Request, Response, NextFunction } from 'express';

export function validateUrl(req: Request, res: Response, next: NextFunction): void {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({
      success: false,
      error: 'URL is required',
    });
    return;
  }

  if (typeof url !== 'string') {
    res.status(400).json({
      success: false,
      error: 'URL must be a string',
    });
    return;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      res.status(400).json({
        success: false,
        error: 'URL must use HTTP or HTTPS protocol',
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid URL format',
    });
    return;
  }

  next();
}
