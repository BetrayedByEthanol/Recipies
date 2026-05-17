import { Request, Response, NextFunction } from 'express';

/**
 * Optional write protection via ADMIN_TOKEN env var.
 * If ADMIN_TOKEN is unset the middleware is a no-op (local/dev behaviour).
 * If set, write routes require: Authorization: Bearer <token>
 */
export function requireAdminToken(req: Request, res: Response, next: NextFunction): void {
  // Intentionally read ADMIN_TOKEN on every request so operators can rotate
  // the token at runtime without restarting the server process.
  const token = process.env.ADMIN_TOKEN?.trim();
  if (!token) {
    next();
    return;
  }

  const header = req.headers.authorization ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (provided !== token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
