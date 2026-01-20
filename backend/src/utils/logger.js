import winston from 'winston';

// Create a centralized logger instance for the application

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  //  Storage location
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }), // all logs
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // errors logs
  ],
});
