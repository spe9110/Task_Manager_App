import os from "os";
import { execSync } from "child_process";

// Get the current Git commit SHA (optional but nice to have)
let commitSHA = "unknown";
try {
  commitSHA = execSync("git rev-parse HEAD").toString().trim();
} catch (err) {
  console.warn("⚠️ Could not retrieve git SHA:", err.message);
}

// Monitoring controller
export const monitoring = async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const pid = process.pid;
    const loadavg = os.loadavg();
    const connections = await getConnectionCount();

    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      memoryUsage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      uptime: `${Math.round(uptime)}s`,
      pid,
      loadavg,
      connections,
      sha: commitSHA,
    });
  } catch (error) {
    console.error("❌ Monitoring endpoint error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve monitoring info",
      error: error.message,
    });
  }
};

// Helper: count active connections
async function getConnectionCount() {
  return new Promise((resolve) => {
    const server = globalThis.server; // must be set in server.js
    if (!server || typeof server.getConnections !== "function") {
      return resolve("unknown");
    }
    server.getConnections((err, count) => {
      if (err) return resolve("unknown");
      resolve(count);
    });
  });
}
