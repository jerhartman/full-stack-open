// middleware for blogs controller

const logger = require('./logger');

const requestLogger = (request, response, next) => {
	logger.info('method:', request.method);
	logger.info('path:', request.path);
	logger.info('body:', JSON.stringify(request.body));
	logger.info('-----');
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);
	if (error.name === 'CastError') {
		response.status(400).json({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		response.status(400).json({ error: error.message });
	}
	next(error);
};

// export middleware to be used in app.js
module.exports = { requestLogger, unknownEndpoint, errorHandler };