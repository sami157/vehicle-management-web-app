import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { FieldOutputTypes } from '../../contract.d.ts';
import { db } from '../../db.ts';
import { getFirebaseAuth } from '../config/firebase-admin.ts';

type DatabaseUser = FieldOutputTypes['public']['User'];
export type UserRole = DatabaseUser['role'];

export interface AuthContext {
  token: DecodedIdToken;
  user: DatabaseUser;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

function unauthorized(res: Response): void {
  res.set('WWW-Authenticate', 'Bearer');
  res.status(401).json({
    error: 'unauthorized',
    message: 'A valid Firebase bearer token is required.',
  });
}

function forbidden(res: Response, message: string): void {
  res.status(403).json({ error: 'forbidden', message });
}

export const requireFirebaseAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    unauthorized(res);
    return;
  }

  let firebaseAuth: ReturnType<typeof getFirebaseAuth>;
  try {
    firebaseAuth = getFirebaseAuth();
  } catch (error) {
    next(error);
    return;
  }

  let token: DecodedIdToken;
  try {
    // Revocation checks are intentionally disabled for the simplest request path.
    token = await firebaseAuth.verifyIdToken(match[1]);
  } catch {
    unauthorized(res);
    return;
  }

  try {
    const existingUser = await db.orm.public.User.where({ firebaseUid: token.uid }).first();
    let user = existingUser;

    if (!user) {
      if (!token.email) {
        forbidden(res, 'A Firebase email is required to create a user account.');
        return;
      }

      user = await db.orm.public.User.create({
        firebaseUid: token.uid,
        email: token.email,
        name: token.name ?? token.email,
        avatarUrl: token.picture ?? null,
      });
    }

    if (!user.isActive) {
      forbidden(res, 'This user account is inactive.');
      return;
    }

    req.auth = { token, user };
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) {
      unauthorized(res);
      return;
    }

    if (!roles.includes(req.auth.user.role)) {
      forbidden(res, 'You do not have permission to access this resource.');
      return;
    }

    next();
  };
}
