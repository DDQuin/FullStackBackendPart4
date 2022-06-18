/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  if (!body.title || !body.url) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
});

module.exports = blogsRouter;
