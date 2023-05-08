// controller to handle user login and authentication

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const loginRouter = require('express').Router();

// post request to login as a user
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const passCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  // return if incorrect username or password
  if (!user || !passCorrect) {
    return response.status(401).json({
      error: 'invalid username or password' 
    });
  }
  // generate token after successful login
  const userForToken = {
    username: user.username,
    id: user._id
  };
  const token = jwt.sign(userForToken, process.env.SECRET);
  // respond with token
  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  });
});

// export router to app.js
module.exports = loginRouter;