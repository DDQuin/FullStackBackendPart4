/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
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

const mostBlogs = (blogs) => {
  const authors = _.groupBy(blogs, 'author');
  const authorNames = Object.keys(authors);
  let maxAuthor = authorNames[0];
  let maxBlogs = authors[maxAuthor].length;
  // eslint-disable-next-line no-restricted-syntax
  for (const author of authorNames) {
    if (authors[author].length > maxBlogs) {
      maxBlogs = authors[author].length;
      maxAuthor = author;
    }
  }
  const returnMostBlogs = {
    author: maxAuthor,
    blogs: maxBlogs,
  };
  return returnMostBlogs;
};

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author');
  const authorNames = Object.keys(authors);
  let maxAuthor = authorNames[0];
  let maxLikes = totalLikes(authors[maxAuthor]);
  // eslint-disable-next-line no-restricted-syntax
  for (const author of authorNames) {
    const currentAuthorMostLikes = totalLikes(authors[author]);
    if (currentAuthorMostLikes > maxLikes) {
      maxLikes = currentAuthorMostLikes;
      maxAuthor = author;
    }
  }
  const returnMostLikes = {
    author: maxAuthor,
    likes: maxLikes,
  };
  return returnMostLikes;
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
