// controller for HTTP requests involving users

const bcrypt = require('bcrypt');
const blogRouter = require('express').Router();
const User = require('../models/user');

// get all users from database
blogRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});

// get a specific user by id
blogRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

// post a new user to the database
blogRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    passwordHash
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

// delete a user from the database
blogRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// export router to app.js
module.exports = blogRouter;