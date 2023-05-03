// test the helper functions in /utils/list_helper

const listHelper = require('./../utils/list_helper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Jason Y. Sumpter',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 12,
    __v: 0
  }
];

// test for dummy function
test('dummy returns 1', () => {
  expect(listHelper.dummy([])).toBe(1);
});

// tests for totalLikes function
describe('total likes', () => {
  
  test('list with zero blogs', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('list with only one blog', () => {
    expect(listHelper.totalLikes(blogs.slice(0, 1))).toBe(7);
  });

  test('list with all blogs', () => {
    expect(listHelper.totalLikes(blogs)).toBe(46);
  });

});

describe('favorite blog', () => {

  test('empty list', () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });

  test('list with one blog', () => {
    expect(listHelper.favoriteBlog(blogs.splice(0, 1)))
      .toEqual({
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7,
      });
  });

  test('entire list of blogs', () => {
    expect(listHelper.favoriteBlog(blogs))
      .toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      });
  });

});

describe('most blogs', () => {

  test('empty list', () => {
    expect(listHelper.mostBlogs([])).toEqual({});
  });

  test('entire list of blogs', () => {
    expect(listHelper.mostBlogs(blogs))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 2
      });
  });

});