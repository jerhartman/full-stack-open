// middleware for blogs controller

const logger = require('./logger');

// log each request sent to the express server
const requestLogger = (request, response, next) => {
  logger.info('method:', request.method);
  logger.info('path:', request.path);
  logger.info('body:', JSON.stringify(request.body));
  logger.info('-----');
  next();
};

// return 404 not found if we cannot find endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

//error handler in case we encounter an issue while accessing the database
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    response.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }
  next(error);
};

// extract user tokens and put them in the request
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '');
  } else {
    request.token = null;
  }
  next();
};

// export middleware to be used in app.js
module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor };