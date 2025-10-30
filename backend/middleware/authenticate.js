import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Get token from either cookies or Authorization header
  const token =
    req.cookies?.AccessToken ||
    (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]);

  if (!token) {
    req.user = null; // mark as not logged in
    return next();
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return next({ status: 401, message: "Invalid token. Not authorized!" });
    }

    // Attach the decoded user ID to request object
    req.user = decoded.id;

    return next();
  } catch (error) {
    return next({ status: 403, message: "Invalid or expired token." });
  }
};
