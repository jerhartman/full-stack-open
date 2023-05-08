// controller for HTTP requests involving blogs

const jwt = require('jsonwebtoken');
const blogRouter = require('express').Router();
const Blog = require('./../models/blog');
const User = require('./../models/user');
// const logger = require('./../utils/logger')

// get all blogs from server
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// get a specific blog post by id
blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

// post a new blog to the server
blogRouter.post('/', async (request, response) => {
  const body = request.body;
  console.log(request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes !== undefined ? body.likes : 0, 
    user: user.id
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.json(savedBlog);
});

// update a blog given the blog id
blogRouter.put('/:id', async (request, response) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({ error: 'content missing' });
  }
  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, note, { new: true });
  response.json(updatedBlog);
});

// delete a blog given the blog id
blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// export the router to app.js
module.exports = blogRouter;