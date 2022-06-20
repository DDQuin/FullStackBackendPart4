/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body;
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  /*
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (exception) {
    next(exception);
  }
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  */
  // eslint-disable-next-line prefer-destructuring
  const user = request.user;

  const blog = new Blog({ ...request.body, user: user.id });

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'missing title or url' }).end();
  }

  const savedBlog = await blog.save();
  // eslint-disable-next-line no-underscore-dangle
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (exception) {
    next(exception);
  }
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'wrong user' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.important,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
