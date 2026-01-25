import winston from 'winston';

// Create a centralized logger instance for the application
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
