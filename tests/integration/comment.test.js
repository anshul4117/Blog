import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/user.js';
import Blog from '../../src/models/blog.js';
import Comment from '../../src/models/comment.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: 'user' },
        process.env.JWT_SECRET || 'testsecret',
        { expiresIn: '1h' }
    );
};

let user1, user2, user1Token, user2Token, blog;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Create Users
    user1 = await User.create({
        name: 'Commenter One',
        email: 'commenter1@example.com',
        password: 'password123',
        username: 'commenter1',
        dateOfJoin: Date.now()
    });
    user1Token = generateToken(user1);

    user2 = await User.create({
        name: 'Commenter Two',
        email: 'commenter2@example.com',
        password: 'password123',
        username: 'commenter2',
        dateOfJoin: Date.now()
    });
    user2Token = generateToken(user2);

    // Create Blog
    blog = await Blog.create({
        title: 'Blog for Comments',
        content: 'This blog will have threaded comments.',
        userId: user1._id
    });
});

afterAll(async () => {
    await User.deleteMany({ email: { $in: ['commenter1@example.com', 'commenter2@example.com'] } });
    await Blog.deleteMany({ _id: blog._id });
    await Comment.deleteMany({});
    await mongoose.connection.close();
});

describe('Comment System Integration', () => {
    let topLevelCommentId;

    it('should create a top-level comment', async () => {
        const res = await request(app)
            .post('/api/v1.2/comments/create')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                blogId: blog._id,
                content: 'This is a top level comment'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.data.content).toBe('This is a top level comment');
        expect(res.body.data.parentId).toBeNull();
        topLevelCommentId = res.body.data._id;
    });

    it('should reply to a comment (Threading)', async () => {
        const res = await request(app)
            .post('/api/v1.2/comments/create')
            .set('Authorization', `Bearer ${user2Token}`)
            .send({
                blogId: blog._id,
                content: 'This is a reply to the top level comment',
                parentId: topLevelCommentId
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.data.parentId).toBe(topLevelCommentId);
    });

    it('should fetch top-level comments for a blog', async () => {
        const res = await request(app)
            .get(`/api/v1.2/comments/blog/${blog._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).toBeGreaterThan(0);
        // Only top level
        expect(res.body.results[0].parentId).toBeNull();
        // Check reply count (should be 1 from previous test)
        expect(res.body.results[0].replyCount).toBe(1);
    });

    it('should fetch replies for a comment', async () => {
        const res = await request(app)
            .get(`/api/v1.2/comments/replies/${topLevelCommentId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].content).toBe('This is a reply to the top level comment');
    });

    it('should soft delete a comment', async () => {
        const res = await request(app)
            .delete(`/api/v1.2/comments/${topLevelCommentId}`)
            .set('Authorization', `Bearer ${user1Token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Comment deleted successfully');

        // Verify in DB
        const comment = await Comment.findById(topLevelCommentId);
        expect(comment.isDeleted).toBe(true);
    });

    it('should check if replies still exist after parent soft delete', async () => {
        const res = await request(app)
            .get(`/api/v1.2/comments/replies/${topLevelCommentId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).toBe(1); // Reply should still be there
    });
});
