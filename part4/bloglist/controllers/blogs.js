// controller for HTTP requests involving blogs

const blogRouter = require('express').Router()
const Blog = require('./../models/blog');
// const logger = require('./../utils/logger')

// get all blogs from server
blogRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

// get a specific blog post by id
blogRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id).then(blog => {
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  })
  .catch(error => next(error));
});

// post a new blog to the server
blogRouter.post('/', (request, response, next) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({ error: 'content missing' });
  }
  const blog = new Blog(body)
  blog.save().then(result => {
    response.status(204).json(result);
  })
  .catch(error => next(error));
});

// update a blog given the blog id
blogRouter.put('/:id', (request, response, next) => {
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
  Blog.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});

// delete a blog given the blog id
blogRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error));
});

// export the router to app.js
module.exports = blogRouter;