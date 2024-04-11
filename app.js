const express = require('express');
const app = express();
const cors = require('cors');
const winston = require('winston');
// const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const routes = require('./src/routes');
const errorMiddleware = require('./middleware/error-middleware');
const response = require('./lib/shared/src/http/response');
global.assert = require('assert');

// Now you can use assert directly without requiring it in each module

app.use(cors());
app.use(express.json());
// app.use(errorHandler);
app.use(express.static('public'));
app.use(errorMiddleware);

const logger = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: 'info',
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level} ${info.message}`
    )
  ),
  // Log to the console and a file
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

app.use((req, res, next) => {
  // Log an info message for each incoming request
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

// Handle HTTP GET requests to the root path
app.get('/', (req, res) => {
  // Log messages at different log levels
  logger.log('error', 'This is an error message');
  logger.log('warn', 'This is a warning message');
  logger.log('info', 'This is an info message');
  logger.log('verbose', 'This is a verbose message');
  logger.log('debug', 'This is a debug message');
  logger.log('silly', 'This is a silly message');
  // Send a response to the client
  res.send('Hello, world!');
});

// A route for manually triggering an error
app.get('/error', (req, res, next) => {
  throw new Error('This is a test error');
});

// Handle errors using the logger

routes(app);

app.use((req, res, next) => {
  const status = response.status.NOT_FOUND;
  const data = response.dispatch({
    error: 'Not Found',
    code: status,
  });
  return res.status(status).json(data);
});


module.exports = app;