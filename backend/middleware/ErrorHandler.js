import logger from "../config/logging.js";

// Basic error handling middleware for Express.js applications
export const errorHandler = (err, req, res, next) => {
  // Log the error with contextual information
  logger.error("Express error caught", {
    message: err.message,
    name: err.name,
    stack: err.stack,
    status: err.status || 500,
    method: req.method,
    path: req.path,
    user: req.user || "anonymous",
    body: req.body || {},
  });

  // Respond to client
  res.status(err.status || 500).json({
    message: err.message || "An error occurred",
    error:
      process.env.NODE_ENV === "production"
        ? {}
        : {
            message: err.message,
            name: err.name,
            stack: err.stack,
          },
  });
};
