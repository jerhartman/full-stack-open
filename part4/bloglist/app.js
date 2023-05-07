// driver for bloglist app, express server is run here

// import dependencies
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// import util functions
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
// import routers
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');

// connect to mongo server
const mongo_url = config.MONGODB_URI;
mongoose.set('strictQuery', false);
logger.info('connecting to', mongo_url);
mongoose.connect(mongo_url)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// use middlewares
app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
// router routes
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
// error handlers
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;