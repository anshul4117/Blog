# Day1-Blogging App — Server

This directory contains the backend server for the Day1-Blogging App. It is a small Express + MongoDB API supporting user registration, login, and basic blog operations.

## Table of contents

- Project structure
- Requirements
- Installation
- Environment variables
- Available scripts
- API endpoints
- How to run (quick)
- Example requests
- Troubleshooting
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
- GET  /auth/login  — login a user (controller: `loginUser.js`)
- GET  /auth/allUsers — list all users (protected with `auth` middleware)

Blog routes (defined in `routes/blog.js`)

- POST /blog/create — create a blog (protected with `auth` middleware)
- GET  /blog/allblogs — list all blogs (protected with `auth` middleware)
- GET  /blog/del-blog — route exists in router but currently has no controller wired
- GET  /blog/up-blog  — route exists in router but currently has no controller wired

## How to run (quick)

From the `Server/` directory, with `.env` configured, run:

```bash
# install
npm install

# start in development (nodemon)
npm run dev
```

By default the server uses the `PORT` value from `.env` (example: 2000).

## Example requests (curl)

1) Register a new user

```bash
curl -X POST http://localhost:2000/auth/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pa55word"}'
```

2) Login (current implementation expects query params)

```bash
curl "http://localhost:2000/auth/login?email=alice@example.com&password=pa55word"
```

Response should include a JWT token. Save it for protected requests.

3) Use JWT to access a protected route (example: list blogs)

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:2000/blog/allblogs
```

## Troubleshooting

- MongoDB connection errors: ensure `MONGO_URI` in `.env` is correct and your IP is allowed (if using Atlas).
- Server won't start or nodemon not found: install nodemon globally (`npm i -g nodemon`) or run `npx nodemon server.js`.
- Login not returning token / failing: verify the `JWT_SECRET` in `.env` matches what the server expects.
- Unexpected route errors: check `routes/*.js` and corresponding controllers in `controllers/` are present and exported.

## Project notes & next steps

- Change `GET /auth/login` to `POST /auth/login` for better security and update the controller accordingly.
- Implement controllers for blog update/delete and wire them into `routes/blog.js`.
- Add request/response examples and tests. Consider adding a small Postman or HTTPie collection.

---

If you'd like, I can make the suggested changes (convert login to POST, implement missing blog controllers, or add a Postman collection). Tell me which you'd prefer.
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
- GET  /auth/login  — login a user (controller: `loginUser.js`)
- GET  /auth/allUsers — list all users (protected with `auth` middleware)

Blog routes (defined in `routes/blog.js`)

- POST /blog/create — create a blog (protected with `auth` middleware)
- GET  /blog/allblogs — list all blogs (protected with `auth` middleware)
- GET  /blog/del-blog — route exists in router but currently has no controller wired
- GET  /blog/up-blog  — route exists in router but currently has no controller wired

Notes:

- `loginUser` is exposed as a GET endpoint in the current code. For security it's recommended to change this to POST and accept credentials in the request body.
- The `del-blog` and `up-blog` routes in `routes/blog.js` currently call `auth` but do not have controller functions attached; you'll want to implement or wire controllers for those routes.

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

GET /auth/login?email=alice@example.com&password=pa55word

After login you should receive a JWT token which is required for protected routes.

## Project notes & next steps

- Change `GET /auth/login` to `POST /auth/login` for better security and update the controller accordingly.
- Implement controllers for blog update/delete and wire them into `routes/blog.js`.
- Add request/response examples and tests. Consider adding a small Postman or HTTPie collection.

---

If you'd like, I can make the suggested changes: convert login to POST, implement missing blog controllers, or add a sample Postman collection. Tell me which you'd prefer.
