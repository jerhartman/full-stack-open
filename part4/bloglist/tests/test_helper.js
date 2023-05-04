// helper file for blog_api.test.js

const Blog = require('../models/blog');

// blogs loaded to test database every time we run jest
const initialBlogs = [
  {
    title: 'yummy quesadilla recipe',
    author: 'ashley katchadorian',
    url: 'https://food.org/quesadilla-yummy',
    likes: 2
  },
  {
    title: 'cheer nationals recap',
    author: 'mackenzie zales',
    url: 'https://cheerlife.com/maskenzie',
    likes: 300
  }
];

// generate an id for a blog that doesn't exist
const nonExistingID = async () => {
  const blog = new Blog({ title: 'will delete blog' });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

// get all blogs from test database
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};



module.exports = { initialBlogs, nonExistingID, blogsInDb };