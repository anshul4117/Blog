import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.js';
import dotenv from 'dotenv';
dotenv.config();

// Connect to a test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

// Clean up after tests
afterAll(async () => {
    await User.deleteMany({ email: 'test@example.com' });
    await mongoose.connection.close();
});

describe('User Integration', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/v1.2/users/create')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                bio: 'I am a test user'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not allow duplicate emails', async () => {
        const res = await request(app)
            .post('/api/v1.2/users/create')
            .send({
                name: 'Test User 2',
                email: 'test@example.com', // Same email
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400); // Expect bad request
    });
});
