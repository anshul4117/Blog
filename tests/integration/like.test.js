import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.js';
import Blog from '../../src/models/blog.js';
import Like from '../../src/models/like.js';
import dotenv from 'dotenv';
dotenv.config();

let user, userToken, blog;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Like.deleteMany({});

    // Create User
    const res = await request(app).post('/api/v1.2/users/create').send({
        name: 'Liker User',
        email: 'liker@example.com',
        password: 'password123',
        username: 'liker'
    });
    user = res.body.user;

    // Login
    const login = await request(app).post('/api/v1.2/users/login').send({
        email: 'liker@example.com',
        password: 'password123'
    });
    userToken = login.body.accessToken;

    // Create Blog (Manual creation to avoid needing blogService mock here)
    blog = await Blog.create({
        title: 'Test Blog',
        content: 'Content',
        userId: user._id || user.id
    });

}, 30000);

afterAll(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Like.deleteMany({});
    await mongoose.connection.close();
});

describe('Like System Integration', () => {

    it('should toggle like ON', async () => {
        const res = await request(app)
            .post('/api/v1.2/likes/toggle')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                targetId: blog._id,
                targetType: 'Blog'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe('liked');

        // Check DB
        const count = await Like.countDocuments({ targetId: blog._id });
        expect(count).toBe(1);
    });

    it('should show correct status when liked', async () => {
        const res = await request(app)
            .get(`/api/v1.2/likes/status?targetId=${blog._id}&targetType=Blog`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.isLiked).toBe(true);
        expect(res.body.data.count).toBe(1);
    });

    it('should toggle like OFF', async () => {
        const res = await request(app)
            .post('/api/v1.2/likes/toggle')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                targetId: blog._id,
                targetType: 'Blog'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe('unliked');

        // Check DB
        const count = await Like.countDocuments({ targetId: blog._id });
        expect(count).toBe(0);
    });

    it('should show correct status when unliked', async () => {
        const res = await request(app)
            .get(`/api/v1.2/likes/status?targetId=${blog._id}&targetType=Blog`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.isLiked).toBe(false);
        expect(res.body.data.count).toBe(0);
    });
});
