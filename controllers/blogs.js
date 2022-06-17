/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs);
    });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);
  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    });
});

module.exports = blogsRouter;
