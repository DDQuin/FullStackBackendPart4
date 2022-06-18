/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs have correct length', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blog has id property', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Computer',
      author: 'DDQuins2',
      url: 'http://google.com',
      likes: 100,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    expect(contents).toContain(
      'Computer',
    );
  });

  test('will have 0 likes if no likes are given', async () => {
    const newBlog = {
      title: 'Computer',
      author: 'DDQuins2',
      url: 'http://google.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const postedBlog = blogsAtEnd.find((b) => b.title === 'Computer');
    expect(postedBlog.likes).toBe(0);
  });

  test('fails with status code 400 if title and url missing', async () => {
    const newBlog = {
      author: 'DD',
      likes: 4,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  }, 10000);
});

describe('deleting blog posts ', () => {
  test('delete a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1,
    );

    const contents = blogsAtEnd.map((b) => (b).title);

    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe('updating blog posts ', () => {
  test('update a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogsAtStartID = blogsAtStart[0].id;
    const blogToUpdate = helper.initialBlogs[0];
    blogToUpdate.likes = 20;

    await api
      .put(`/api/blogs/${blogsAtStartID}`)
      .send(blogToUpdate)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length,
    );

    const blogUpdated = blogsAtEnd.find((b) => b.id === blogsAtStartID);

    expect(blogUpdated.likes).toBe(20);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
