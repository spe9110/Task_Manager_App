import jwt from 'jsonwebtoken';
import { secretOrKey } from '../config/key.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Get token from either cookies or Authorization header
  const token =
    req.cookies?.AccessToken ||
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]);

  if (!token) {
    req.user = null; // just mark as not logged in
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretOrKey);

    if (!decoded.id) {
      return next({ status: 401, message: "Invalid token. Not authorized!" });
    }

    req.user = decoded.id; // Attach user ID to request object
    return next(); // Proceed to the next middleware or route handler

  } catch (error) {
    return next({status: 403, message: "Invalid or expired token."})
  }
};