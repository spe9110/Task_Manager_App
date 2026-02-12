import winston from "winston";
import { PapertrailTransport } from "winston-papertrail";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" })
  ]
});

logger.add(new PapertrailTransport({
  host: "logs.papertrailapp.com",
  port: 12345, // replace with your actual port
  program: "my-node-app",
  colorize: true
}));

export default logger;
