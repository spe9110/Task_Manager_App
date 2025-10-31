import os from "os";
import mongoose from "mongoose";
import { execSync } from "child_process";
import { activeUsers } from "../middleware/requestLogger.js";
import User from "../models/user.model.js";

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
    const totalUsers = await User.countDocuments();
    const activeCount = activeUsers.size;
    const connectionCount = await getConnectionCount();

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const dbState = mongoose.connection.readyState; // 1 = connected
    const loadavg = os.loadavg();
    const pid = process.pid;

    const commitSHA = execSync("git rev-parse --short HEAD").toString().trim();

    res.json({
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
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};