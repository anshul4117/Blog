import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.js';
import Follow from '../../src/models/follow.js';
import dotenv from 'dotenv';
dotenv.config();

let user1, user2, user1Token, user2Token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Follow.deleteMany({});

    // Create User 1
    const res1 = await request(app).post('/api/v1.2/users/create').send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'password123',
        username: 'user1'
    });
    user1 = res1.body.user;

    // Login User 1 to get token
    const login1 = await request(app).post('/api/v1.2/users/login').send({
        email: 'user1@example.com',
        password: 'password123'
    });
    user1Token = login1.body.accessToken;

    // Create User 2
    const res2 = await request(app).post('/api/v1.2/users/create').send({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'password123',
        username: 'user2'
    });
    user2 = res2.body.user;

    // Login User 2 to get token (optional, but good to have)
    const login2 = await request(app).post('/api/v1.2/users/login').send({
        email: 'user2@example.com',
        password: 'password123'
    });
    user2Token = login2.body.accessToken;
}, 30000);

afterAll(async () => {
    await User.deleteMany({});
    await Follow.deleteMany({});
    await mongoose.connection.close();
});

describe('Follow System Integration', () => {
    it('should allow User 1 to follow User 2', async () => {
        const res = await request(app)
            .post(`/api/v1.2/users/${user2._id}/follow`)
            .set('Authorization', `Bearer ${user1Token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User followed successfully');

        // Verify DB
        const follow = await Follow.findOne({ followerId: user1._id, followingId: user2._id });
        expect(follow).toBeTruthy();
    });

    it('should prevent duplicate following', async () => {
        const res = await request(app)
            .post(`/api/v1.2/users/${user2._id}/follow`)
            .set('Authorization', `Bearer ${user1Token}`);

        expect(res.statusCode).toEqual(400); // Bad Request
        expect(res.body.message).toBe('You are already following this user');
    });

    it('should list followers correctly', async () => {
        const res = await request(app)
            .get(`/api/v1.2/users/${user2._id}/followers`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.results).toBe(1);
        expect(res.body.data.followers[0]._id).toBe(user1._id);
    });

    it('should list following correctly', async () => {
        const res = await request(app)
            .get(`/api/v1.2/users/${user1._id}/following`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.results).toBe(1);
        expect(res.body.data.following[0]._id).toBe(user2._id);
    });

    it('should allow User 1 to unfollow User 2', async () => {
        const res = await request(app)
            .delete(`/api/v1.2/users/${user2._id}/follow`)
            .set('Authorization', `Bearer ${user1Token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User unfollowed successfully');

        // Verify DB
        const follow = await Follow.findOne({ followerId: user1._id, followingId: user2._id });
        expect(follow).toBeNull();
    });
});
