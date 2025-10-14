# Day1-Blogging App — Server

This directory contains the backend server for the Day1-Blogging App. It is a small Express + MongoDB API supporting user registration, login, and basic blog operations.

## Table of contents

- Project structure
- Requirements
- Installation
- Environment variables
- Available scripts
- API endpoints
- Project notes & next steps

## Project structure

```
Server/
├── controllers/
│   ├── blog/
│   │   ├── allblogs.js
│   │   ├── blogs.js
│   │   └── create.js
│   └── user/
│       ├── createUser.js
│       ├── getAllUsers.js
│       └── loginUser.js
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── models/
│   ├── blog.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── blog.js
├── server.js
├── package.json
├── .env.example
└── README.MD
```

## Requirements

- Node.js (v16+ recommended)
- npm
- MongoDB (Atlas or local)

## Installation

1. Change to the `Server/` directory.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your values (see below).

4. Start the server in development mode:

```bash
npm run dev
```

## Environment variables

Create a `.env` file in `Server/` (do not commit it). The project includes `.env.example` with these keys:

```
PORT = 2000
MONGO_URI = mongodb+srv://<username>:<password>@<cluster>/<dbname>
JWT_SECRET = <your-jwt-secret>
```

Replace placeholders with real values. `MONGO_URI` should point to your MongoDB instance.

## Available scripts

- `npm run dev` — start the server with `nodemon server.js` (development)

The `package.json` currently defines only the `dev` script.

## API endpoints (overview)

Base URL: http://localhost:<PORT> (default: 2000)

Auth routes (defined in `routes/auth.js`)

- POST /auth/create — register a new user (controller: `createUser.js`)
- POST  /auth/login  — login a user (controller: `loginUser.js`)
- GET  /auth/allUsers — list all users (protected with `auth` middleware)

Blog routes (defined in `routes/blog.js`)

- POST /blogs/create — create a blog (protected with `auth` middleware)
- GET  /blogs/allblogs — list all blogs (protected with `auth` middleware)
- DELETE  /blogs/del-blog/:id — delete a particular bolg grom db (protected with `auth` middleware)
- GET  /blogs/:id  — get a particular blog by id from db (protected with `auth` middleware)

## Quick example (register + login)

Register a user:

POST /auth/create
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "pa55word"
}

Login (current implementation expects query params):

POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "pa55word"
}

After login you should receive a JWT token which is required for protected routes.

## Project notes & next steps


- Implement controllers for blog update/delete and wire them into `routes/blog.js`.
- Add request/response examples and tests. Consider adding a small Postman or HTTPie collection.