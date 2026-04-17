# Blog API 🚀

A production-ready REST API for a modern blogging platform. Built with **Node.js**, **Express**, **MongoDB**, and **Redis**.

## Features

### 🔐 Authentication & Security
- JWT Access + Refresh Token rotation
- Password reset via email OTP
- Token blacklisting on logout
- Helmet, XSS sanitization, NoSQL injection protection
- Rate limiting (100 req/15min general, 5 req/hr login)
- Joi schema validation

### 📝 Blog Engine
- CRUD with Cloudinary image upload (auto-cleanup on delete)
- Draft/Published support (`published` field)
- Full-text search on title & content
- Pagination, sorting, field selection
- Redis caching with smart invalidation (Set registry pattern)
- Aggregated response with `likeCount` & `commentCount`

### 👤 User Management
- Profile with avatar upload/delete (Cloudinary)
- User search by name/username
- Social links, bio, profession

### 💬 Social Features
- **Like** — Toggle like/unlike on blogs (write-through cache)
- **Comment** — Single-level comments with soft delete
- **Follow** — Follow/unfollow with followers/following lists
- **Bookmark** — Save/unsave blogs for later

### ⚡ Performance
- Redis caching (Cache-Aside + Write-Through)
- O(1) cache invalidation via Redis Set registry
- MongoDB text indexes & compound indexes
- Pino structured logging

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| Auth | JWT (jsonwebtoken) |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Docs | Swagger (OpenAPI 3.0) |
| Testing | Jest + Supertest |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Installation
```bash
git clone <repository_url>
cd Server
npm install
```

### Configuration
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### Run
```bash
# Development (hot reload)
npm run dev

# Production
npm start

# Tests
npm test -- --runInBand
```

### API Docs
Start the server and open: **http://localhost:2000/api-docs**

### Health Check
```
GET http://localhost:2000/health
```

---

## API Endpoints

### Auth (`/api/v1.2/users`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | — | Register |
| `POST` | `/login` | — | Login (sets tokens in cookies) |
| `POST` | `/logout` | — | Logout (blacklists token) |
| `POST` | `/refresh-token` | — | Refresh access token |
| `GET` | `/profile` | ✅ | Get profile with follower counts |
| `PATCH` | `/update-user-profile` | ✅ | Update profile (+ avatar upload) |
| `PATCH` | `/change-password` | ✅ | Change password |
| `DELETE` | `/profile-picture` | ✅ | Remove profile picture |
| `POST` | `/forgot-password` | — | Send OTP to email |
| `POST` | `/reset-password` | — | Reset password with OTP |
| `GET` | `/search?q=john` | — | Search users |
| `GET` | `/allUsers` | ✅ | List all users |

### Blogs (`/api/v1.2/blogs`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/allblogs` | — | All blogs (paginated, with counts) |
| `POST` | `/create` | ✅ | Create blog (+ image upload) |
| `GET` | `/post/:id` | ✅ | Get blog by ID |
| `GET` | `/myblogs` | ✅ | My blogs |
| `PATCH` | `/edit/:id` | ✅ | Update blog (owner only) |
| `DELETE` | `/del-blog/:id` | ✅ | Delete blog + Cloudinary cleanup (owner only) |

### Likes (`/api/v1.2/likes`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/toggle` | ✅ | Like/unlike a blog |
| `GET` | `/status` | ✅ | Check like status & count |

### Comments (`/api/v1.2/comments`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/blog/:blogId` | — | Get blog comments (paginated) |
| `POST` | `/create` | ✅ | Create comment |
| `PATCH` | `/:id` | ✅ | Update comment (owner only) |
| `DELETE` | `/:id` | ✅ | Soft delete comment (owner only) |

### Bookmarks (`/api/v1.2/bookmarks`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/toggle` | ✅ | Save/unsave a blog |
| `GET` | `/my` | ✅ | My saved blogs |
| `GET` | `/check/:blogId` | ✅ | Check if bookmarked |

### Follow (`/api/v1.2/users`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/:id/follow` | ✅ | Follow a user |
| `DELETE` | `/:id/follow` | ✅ | Unfollow a user |
| `GET` | `/:id/followers` | — | List followers |
| `GET` | `/:id/following` | — | List following |

---

## Project Structure

```
src/
├── config/          # DB, Redis, Cloudinary, Swagger, Mailer setup
├── controllers/     # Request handlers (thin layer)
│   ├── blog/        # Blog CRUD + cache invalidation
│   ├── user/        # Auth, profile, search, password reset
│   └── comment/     # Comment CRUD
├── docs/            # Swagger JSDoc annotations
├── middleware/      # Auth, rate limit, validation, XSS, error handler
├── models/          # Mongoose schemas (User, Blog, Like, Comment, Bookmark, Follow, RefreshToken)
├── routes/          # Express route definitions
├── services/        # Business logic (blog, like, comment, bookmark, follow)
├── utils/           # AppError, APIFeatures, cache helpers
└── validators/      # Joi validation schemas
```

---

## Docker

```bash
# Run everything (App + MongoDB + Redis)
docker-compose up --build

# Stop
docker-compose down
```

See [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) for a beginner-friendly walkthrough.

---

## License

ISC