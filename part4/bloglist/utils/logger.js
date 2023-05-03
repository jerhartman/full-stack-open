// logger functions for application

// log information to console
const info = (message) => {
  console.log(message)
};

// log error to console
const error = (message) => {
  console.error(message)
};

module.exports = { info, error };