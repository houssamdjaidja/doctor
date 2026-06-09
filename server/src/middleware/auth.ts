import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'doctor-app-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: number;
  userType?: 'patient' | 'admin';
}

export function generateToken(payload: { id: number; type: 'patient' | 'admin' }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function requirePatient(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; type: string };
    if (decoded.type !== 'patient') {
      res.status(403).json({ error: 'Accès réservé aux patients' });
      return;
    }
    req.userId = decoded.id;
    req.userType = 'patient';
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; type: string };
    if (decoded.type !== 'admin') {
      res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      return;
    }
    req.userId = decoded.id;
    req.userType = 'admin';
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; type: string };
      req.userId = decoded.id;
      req.userType = decoded.type as 'patient' | 'admin';
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }
  next();
}
