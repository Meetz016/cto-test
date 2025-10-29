import type { Request, Response, NextFunction } from 'express';

/**
 * Fallback middleware that returns a 404 response when no routes match.
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};
