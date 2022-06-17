/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const blogsRouter = require('../controllers/blogs');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (!blogs) return 0;
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const max = blogs.reduce((pre, current) => ((pre.likes > current.likes) ? pre : current));
  const returnBlog = {
    title: max.title,
    author: max.author,
    likes: max.likes,
  };
  return returnBlog;
};

module.exports = {
  dummy, totalLikes, favoriteBlog,
};
