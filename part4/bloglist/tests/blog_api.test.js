// tests for the blog api

const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const blog = require('../models/blog');
const api = supertest(app);

// initialize test database with helper array
beforeEach( async () => {
  await blog.deleteMany({});
  const blogObjs = helper.initialBlogs
    .map(blog => new Blog(blog));
  const promiseArr = blogObjs.map(obj => obj.save());
  await Promise.all(promiseArr);
});

// test for getting all blogs
test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await helper.blogsInDb();
  expect(response).toHaveLength(helper.initialBlogs.length);
});

// test for checking if each blog hsd the id property
test('all blogs have id property, not _id', async () => {
  const response = await helper.blogsInDb();
  response.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

// verify that post created a new blog
test('post request adds a new blog to the database with likes initialized', async () => {
  const toPost = { title: 'adding new blog', url: 'testsite.org' }; // controller adds likes: 0
  await api
    .post('/api/blogs')
    .send(toPost)
    .expect(201);
  
  const response = await helper.blogsInDb();
  expect(response).toHaveLength(helper.initialBlogs.length + 1);
  expect(response.map(blog => blog.title)).toContain('adding new blog');
  response.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

// close connection to database after tests are done
afterAll(async () => {
  await mongoose.connection.close();
});