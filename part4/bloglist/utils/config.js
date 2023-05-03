/* eslint-disable no-undef */
// config variables for application

require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = { PORT, MONGODB_URI };