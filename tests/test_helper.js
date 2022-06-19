/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Xbox',
    author: 'DDQuins',
    url: 'http://google.com',
    likes: 10,
  },
  {
    title: 'PS5',
    author: 'DDQuin',
    url: 'http://google.com',
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'PS5',
      author: 'DDQuin',
      url: 'http://google.com',
      likes: 5,
    },
  );

  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,
};
