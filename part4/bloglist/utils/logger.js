// logger functions for application

// log information to console
const info = (message) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message);
  }
};

// log error to console
const error = (message) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(message);
  }
};

module.exports = { info, error };