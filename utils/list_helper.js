/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (!blogs) return 0;
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

module.exports = {
  dummy, totalLikes,
};
