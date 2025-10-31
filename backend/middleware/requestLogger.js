import { v4 as uuidv4 } from "uuid";
import promClient from "prom-client";
import logger from "../config/logging.js";

// Prometheus metrics
const httpDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "statusCode"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequests = new promClient.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "statusCode"],
});

const httpErrors = new promClient.Counter({
  name: "http_requests_errors_total",
  help: "Total HTTP errors",
  labelNames: ["method", "route"],
});

const activeUsers = new Set(); // Track unique active user IDs in memory

function scrub(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  const SENSITIVE = ["password", "token"];
  for (const key of Object.keys(clone)) {
    if (SENSITIVE.includes(key.toLowerCase())) clone[key] = "[REDACTED]";
  }
  return clone;
}

const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  const start = process.hrtime();
  const safeBody = scrub(req.body);
  const bodySize = Buffer.byteLength(JSON.stringify(safeBody));

  if (req.user?.id) activeUsers.add(req.user.id);

  req.requestId = requestId;

  logger.info("HTTP request start", {
    request_id: requestId,
    method: req.method,
    route: req.path,
    user_id: req.user ? req.user.id : "anonymous",
    body_size_bytes: bodySize,
  });

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationSec = diff[0] + diff[1] / 1e9;

    httpDuration.labels(req.method, req.path, String(res.statusCode)).observe(durationSec);
    httpRequests.labels(req.method, req.path, String(res.statusCode)).inc();
    if (res.statusCode >= 400) httpErrors.labels(req.method, req.path).inc();

    logger.info("HTTP request end", {
      request_id: requestId,
      status_code: res.statusCode,
      duration: `${durationSec.toFixed(3)}s`,
    });
  });

  next();
};

export { requestLogger, activeUsers, httpRequests, httpDuration, httpErrors };


/*
Logging — Track user activity & performance
*/ 