# Professional Blogging Platform API 🚀

A production-ready, scalable backend for a modern blogging application. Built with **Node.js**, **Express**, and **MongoDB**, featuring advanced patterns like **Polymorphic Associations** (Likes), **Adjacency Lists** (Comments), and **Service-Repository Architecture**.

---

## 🌟 Key Features

### 🔐 Authentication & Security
-   **JWT Authentication**: Secure Access & Refresh Token rotation.
-   **Security Hardening**: `Helmet` headers, XSS sanitization, and Mongo Injection protection.
-   **Rate Limiting**: DDoS protection (100 req/15min) + Brute-force protection on login.
-   **Strict Validation**: `Joi` schemas ensure data integrity before it hits the database.

### 👤 User Management
-   **Profile System**: Update avatars (Cloudinary integration with auto-cleanup), bio, and social links.
-   **Social Graph**: Follow/Unfollow system with efficient "My Feed" generation capabilities.

### 📝 Blog Engine
-   **CRUD**: Full management of blog posts.
-   **Caching**: **Redis** caching strategy (Cache-Aside) for high-performance reads (`/allblogs`).
-   **Search & pagination**: Optimized query handling.

### ❤️ & 💬 Social Engagement
-   **Polymorphic Likes**: A single scalable `Like` model handles Blogs (and comments in the future).
-   **Threaded Comments**: "Reddit-style" infinite nesting using Adjacency List pattern.
    -   **Soft Deletes**: Deleting a comment preserves the reply thread context.
    -   **On-Demand Loading**: Fetch top-level comments first, then drill down into replies.

### ⚡ Performance & Reliability
-   **Structured Logging**: `Pino` logger for observability.
-   **Centralized Error Handling**: Unified error response format.
-   **Test Coverage**: Integration tests for all critical user flows (`Jest` + `Supertest`).

---

## 🛠️ Tech Stack

-   **Runtime**: Node.js v18+
-   **Framework**: Express.js v5
-   **Database**: MongoDB (Mongoose v8)
-   **Caching**: Redis (ioredis)
-   **Testing**: Jest, Supertest
-   **Cloud**: Cloudinary (Media)

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js (v18+)
-   MongoDB (Running locally or Atlas URI)
-   Redis (Running locally)

### 2. Installation
```bash
git clone <repository_url>
cd Server
npm install
```

### 3. Configuration
Create a `.env` file in the root (copied from `.env.example`):
```env
# Application
PORT=2000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.0.1:27017/blogdb
REDIS_URL=redis://127.0.0.1:6379

# Security
JWT_SECRET=super_secret_key_change_this_in_prod
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=super_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Running the Server
```bash
# Development (Hot Reload)
npm run dev

# Production Mode
npm start
```

### 5. Running Tests
```bash
# Run all integration tests
npm test

# Serial mode (Recommended for DB reliability)
npm test -- --runInBand
```

---

## 📡 API Documentation

### **Authentication**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1.2/users/create` | Register new user |
| `POST` | `/api/v1.2/users/login` | Login (Returns Access + Refresh Token) |
| `POST` | `/api/v1.2/users/logout` | Logout (Revokes Refresh Token) |

### **Social Graph (Follows)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1.2/users/:id/follow` | Follow a user |
| `DELETE` | `/api/v1.2/users/:id/follow` | Unfollow a user |
| `GET` | `/api/v1.2/users/:id/followers` | List followers (Paginated) |

### **Engagement (Likes)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1.2/likes/toggle` | Toggle Like on Blog/Comment |
| `GET` | `/api/v1.2/likes/status` | Check if user liked item |

### **Discussion (Comments)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1.2/comments/create` | content, blogId, [parentId] |
| `GET` | `/api/v1.2/comments/blog/:id` | Get top-level comments |
| `GET` | `/api/v1.2/comments/replies/:id` | Get replies for a comment |

---

## 📂 Project Structure

```
src/
├── config/         # Environment & DB setup
├── controllers/    # Request handlers (Thin layer)
├── middleware/     # Auth, Logging, Validation
├── models/         # Mongoose Schemas (User, Blog, Like, Comment)
├── routes/         # API Route definitions
├── services/       # Business Logic (The heavy lifting)
└── utils/          # Helpers (AppError, Cloudinary)
```

## 🤝 Contributing
1.  Fork the repository
2.  Create functionality branch (`git checkout -b feature/amazing`)
3.  Commit changes (`git commit -m 'Add amazing feature'`)
4.  Push to branch (`git push origin feature/amazing`)
5.  Open a Pull Request

---

## 📄 License
ISC