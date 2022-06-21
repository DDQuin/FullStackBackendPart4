/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const User = require('../models/user');
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
  let token = null;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
    const userLogin = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(userLogin);
    token = response.body.token;
  });
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Computer',
      author: 'DDQuins2',
      url: 'http://google.com',
      likes: 100,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
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
      .set('Authorization', `bearer ${token}`)
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
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  }, 10000);
  test('fails if token missing', async () => {
    const newBlog = {
      title: 'pog',
      author: 'DD',
      likes: 4,
      url: 'http://google.com',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer 2e')
      .send(newBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('deleting blog posts ', () => {
  let token = null;
  let blogId = null;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
    const userLogin = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(userLogin);
    token = response.body.token;

    const newBlog = {
      title: 'Computer5',
      author: 'DDQuins2',
      url: 'http://google.com',
    };

    const newBlogRes = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog);
    blogId = newBlogRes.body.id;
  });
  test('delete a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1,
    );

    const contents = blogsAtEnd.map((b) => (b).title);

    expect(contents).not.toContain('Computer5');
  });
});

describe('updating blog posts ', () => {
  let token = null;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
    const userLogin = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(userLogin);
    token = response.body.token;
  });
  test('update a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogsAtStartID = blogsAtStart[0].id;
    const blogToUpdate = helper.initialBlogs[0];
    blogToUpdate.likes = 20;

    await api
      .put(`/api/blogs/${blogsAtStartID}`)
      .set('Authorization', `bearer ${token}`)
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username not given', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password must be given');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if password given with < 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'Superuser',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password must have atleast 3 characters');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
