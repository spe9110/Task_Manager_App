import winston, { format, transports } from 'winston';
import os from 'os';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors } = format;

const jsonFormat = combine(
  errors({ stack: true }), // capture stack traces
  timestamp(),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: process.env.APP_NAME || 'task-manager',
    environment: process.env.NODE_ENV || 'development',
    host: os.hostname(), // adds server or container name
  },
  format: jsonFormat,
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: `${process.env.LOG_DIR || 'logs'}/task-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
  exitOnError: false,
});


export default logger;