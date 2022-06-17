/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info, error,
};
