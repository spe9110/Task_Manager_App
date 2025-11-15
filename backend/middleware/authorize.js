// Middleware factory
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      next({ status: 403, message: `Access denied: ${role} role required` });
    }
  }
}

export default requireRole;