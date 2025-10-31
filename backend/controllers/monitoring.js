import os from "os";
import mongoose from "mongoose";
import { execSync } from "child_process";
import { activeUsers } from "../middleware/requestLogger.js";
import User from "../models/user.model.js";
import logger from "../config/logging.js";

async function getConnectionCount() {
  return new Promise((resolve) => {
    const server = globalThis.server;
    if (!server || typeof server.getConnections !== "function") {
      return resolve("unknown");
    }
    server.getConnections((err, count) => {
      if (err) return resolve("unknown");
      resolve(count);
    });
  });
}

export const getMonitoringData = async (req, res) => {
  try {
    logger.info("getMonitoringData - start monitoring request");

    const totalUsers = await User.countDocuments();
    const activeCount = activeUsers.size;
    const connectionCount = await getConnectionCount();

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const dbState = mongoose.connection.readyState; // 1 = connected
    const loadavg = os.loadavg();
    const pid = process.pid;

    let commitSHA = "unknown";
    try {
      commitSHA = execSync("git rev-parse --short HEAD").toString().trim();
    } catch (gitErr) {
      logger.warn("getMonitoringData - git commit SHA not found", { error: gitErr.message });
    }

    const data = {
      status: "ok",
      timestamp: new Date().toISOString(),
      totalUsers,
      activeUsers: activeCount,
      connections: connectionCount,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heap: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      uptime: `${Math.round(uptime)}s`,
      dbStatus: dbState === 1 ? "connected" : "disconnected",
      loadavg,
      pid,
      commit: commitSHA,
    };

    logger.info("getMonitoringData - monitoring data prepared", data);

    res.json(data);
  } catch (err) {
    logger.error("getMonitoringData - error fetching monitoring data", { error: err.message });
    res.status(500).json({ status: "error", message: err.message });
  }
};
