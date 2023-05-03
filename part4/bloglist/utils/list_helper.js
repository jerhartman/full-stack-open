// helper functions for the application

const _ = require('lodash');

// test function to experiment with jest
const dummy = (blogs) => {
  blogs.length;
  return 1;
};

// returns the total number of likes from an array of posts
const totalLikes = (blogs) => {
  let total = 0;
  blogs.forEach(blog => {
    total += blog.likes;
  });
  return blogs.length === 0
    ? 0
    : total;
};

// returns the blog with the most likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let cur = blogs[0];
  blogs.forEach(blog => {
    if (blog.likes > cur.likes) {
      cur = blog;
    }
  });
  return {
    title: cur.title,
    author: cur.author,
    likes: cur.likes
  };
};

//
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const authorCounts = _.countBy(blogs, 'author');
  const authorList = [];

  _.forEach(authorCounts, (count, author) => {
    authorList.push({ author: author, blogs: count });
  });

  return _.maxBy(authorList, 'blogs');
};

// export helpers for testing
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };