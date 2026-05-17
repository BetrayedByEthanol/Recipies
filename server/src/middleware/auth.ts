import { Request, Response, NextFunction } from 'express';

/**
 * Optional write protection via ADMIN_TOKEN env var.
 * If ADMIN_TOKEN is unset the middleware is a no-op (local/dev behaviour).
 * If set, write routes require: Authorization: Bearer <token>
 */
export function requireAdminToken(req: Request, res: Response, next: NextFunction): void {
  // Re-read on every request intentionally so ADMIN_TOKEN can be rotated without restarting.
  const token = process.env.ADMIN_TOKEN?.trim();
  if (!token) {
    next();
    return;
  }

  const header = req.headers.authorization ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (provided !== token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
