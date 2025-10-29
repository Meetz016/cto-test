import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ApiError } from '../utils/errors';

const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

const formatZodError = (error: ZodError) =>
  error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.join('.'),
  }));

/**
 * Centralized error handler that converts thrown errors into JSON HTTP responses.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: formatZodError(err),
      },
    });
    return;
  }

  if (isApiError(err)) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
    },
  });
};
