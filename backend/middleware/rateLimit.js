// rateLimit.js
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequests = 10; // Max requests per IP per window
const ipRequestLog = new Map(); // Store request timestamps per IP

const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  // Retrieve or initialize request timestamps for this IP
  const timestamps = ipRequestLog.get(ip) || [];

  // Keep only timestamps within the time window
  const recentRequests = timestamps.filter(
    (time) => now - time < rateLimitWindowMs
  );

  // Add the current timestamp
  recentRequests.push(now);

  // Update the map
  ipRequestLog.set(ip, recentRequests);

  // Check if the limit is exceeded
  if (recentRequests.length > maxRequests) {
    return res.status(429).json({
      status: "error",
      message: "Too many requests. Please try again later.",
    });
  }

  // Continue request flow
  next();
};

export default rateLimit;
