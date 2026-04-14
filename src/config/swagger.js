import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.2.0',
      description: 'A production-ready blogging platform API with authentication, social features, and caching.',
    },
    servers: [
      { url: 'http://localhost:2000', description: 'Development' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            profilePicture: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                publicId: { type: 'string' }
              }
            }
          }
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            image: {
              type: 'object',
              properties: {
                url: { type: 'string', nullable: true },
                publicId: { type: 'string', nullable: true }
              }
            },
            userId: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            published: { type: 'boolean' },
            likeCount: { type: 'integer' },
            commentCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            content: { type: 'string', maxLength: 1000 },
            blogId: { type: 'string' },
            userId: { type: 'string' },
            isDeleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'User registration, login, logout, and profile management' },
      { name: 'Blogs', description: 'Blog CRUD operations with image upload' },
      { name: 'Comments', description: 'Comment system for blogs' },
      { name: 'Likes', description: 'Like/unlike toggle for blogs' },
      { name: 'Bookmarks', description: 'Save/unsave blogs for later' },
      { name: 'Follow', description: 'Follow/unfollow social features' }
    ]
  },
  apis: ['./src/docs/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
