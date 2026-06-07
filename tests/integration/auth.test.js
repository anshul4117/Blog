import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.js';
import RefreshToken from '../../src/models/RefreshToken.js';
import dotenv from 'dotenv';

dotenv.config();

const testUser = {
  name: 'Auth Test User',
  email: 'authtest@example.com',
  password: 'password123',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // Clean up any stale test user
  await User.deleteMany({ email: testUser.email });
  await RefreshToken.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await RefreshToken.deleteMany({});
  await mongoose.connection.close();
});

describe('Authentication & Cookies Integration', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1.2/users/create')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
  });

  it('should login and set HttpOnly cookies with path="/" and no duplicates', async () => {
    const res = await request(app)
      .post('/api/v1.2/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify cookies are present and formatted correctly
    const cookies = res.headers['set-cookie'].join('; ');
    expect(cookies).toContain('accessToken=');
    expect(cookies).toContain('refreshToken=');
    expect(cookies).toContain('Path=/');
    expect(cookies).toContain('HttpOnly');

    // Verify in database that only ONE refresh token is created
    const userInDb = await User.findOne({ email: testUser.email });
    const refreshTokens = await RefreshToken.find({ userId: userInDb._id });
    expect(refreshTokens.length).toBe(1);
  });

  it('should refresh access token using cookies', async () => {
    // 1. Login to get cookies
    const loginRes = await request(app)
      .post('/api/v1.2/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    
    const cookies = loginRes.headers['set-cookie'];

    // 2. Call refresh token endpoint with cookies
    const refreshRes = await request(app)
      .post('/api/v1.2/users/refresh-token')
      .set('Cookie', cookies)
      .send(); // no body

    expect(refreshRes.statusCode).toEqual(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    expect(refreshRes.headers['set-cookie']).toBeDefined();

    const newCookies = refreshRes.headers['set-cookie'].join('; ');
    expect(newCookies).toContain('accessToken=');
    expect(newCookies).toContain('Path=/');
    expect(newCookies).toContain('HttpOnly');
  });

  it('should logout and clear cookies', async () => {
    // 1. Login to get cookies
    const loginRes = await request(app)
      .post('/api/v1.2/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    
    const cookies = loginRes.headers['set-cookie'];

    // 2. Call logout with cookies
    const logoutRes = await request(app)
      .post('/api/v1.2/users/logout')
      .set('Cookie', cookies)
      .send();

    expect(logoutRes.statusCode).toEqual(200);
    expect(logoutRes.headers['set-cookie']).toBeDefined();

    const clearedCookies = logoutRes.headers['set-cookie'].join('; ');
    // Expired dates or empty values in cleared cookies
    expect(clearedCookies).toContain('accessToken=;');
    expect(clearedCookies).toContain('refreshToken=;');
  });
});
