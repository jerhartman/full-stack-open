// controller for HTTP requests involving blogs

const blogRouter = require('express').Router();
const Blog = require('./../models/blog');
// const logger = require('./../utils/logger')

// get all blogs from server
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
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
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'content missing' });
  }
  const blog = new Blog(body);
  if (!blog.likes) {
    blog.likes = 0;
  }
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
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