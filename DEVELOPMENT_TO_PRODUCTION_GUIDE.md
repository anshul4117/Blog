# Development to Production: Complete Professional Guide

A step-by-step guide for building, testing, securing, and deploying a production-ready Node.js application—from local development to live production environments.

---

## Table of Contents

1. [Phase 1: Project Setup & Architecture](#phase-1-project-setup--architecture)
2. [Phase 2: Core Development](#phase-2-core-development)
3. [Phase 3: Testing & Quality](#phase-3-testing--quality)
4. [Phase 4: Security Hardening](#phase-4-security-hardening)
5. [Phase 5: Containerization](#phase-5-containerization)
6. [Phase 6: Infrastructure & Deployment](#phase-6-infrastructure--deployment)
7. [Phase 7: Monitoring & Operations](#phase-7-monitoring--operations)
8. [Phase 8: Post-Deployment](#phase-8-post-deployment)

---

## Phase 1: Project Setup & Architecture

### Step 1.1: Initialize Git Repository

```bash
# Initialize a new Git repository
git init

# Create .gitignore (exclude secrets, logs, node_modules, etc.)
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env
.env.local
.env.*.local
logs/
coverage/
.DS_Store
*.log
.idea/
.vscode/
.eslintcache
EOF

# Make initial commit
git add .
git commit -m "Initial project setup"
```

### Step 1.2: Set Up Project Metadata

```bash
# Initialize package.json with proper metadata
npm init -y

# Update package.json with your project details
# Example:
# {
#   "name": "blogging-app",
#   "version": "1.0.0",
#   "description": "Professional blogging platform",
#   "main": "src/server.js",
#   "engines": { "node": ">=18.0.0" },
#   "scripts": {
#     "start": "node src/server.js",
#     "dev": "nodemon src/server.js",
#     "test": "jest",
#     "test:watch": "jest --watch",
#     "lint": "eslint src/",
#     "lint:fix": "eslint src/ --fix"
#   }
# }
```

### Step 1.3: Implement Folder Structure

```bash
# Create the complete production folder structure
mkdir -p src/{config,routes,controllers/{user,blog,explore},services,models,repositories,middleware,validators,errors,jobs,tasks,utils/helper,public}
mkdir -p tests/{unit/{services,utils},integration/{routes,controllers},fixtures}
mkdir -p infra/{kubernetes,terraform}
mkdir -p docker
mkdir -p .github/workflows
mkdir -p ci
mkdir -p scripts
mkdir -p logs coverage

# Add .gitkeep files to keep empty directories in Git
touch logs/.gitkeep coverage/.gitkeep src/public/.gitkeep

# Verify structure
tree -L 3 -a
```

### Step 1.4: Create Core Configuration Files

**Create `src/config/index.js`:**

```javascript
// src/config/index.js
require('dotenv').config();

const config = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  APP_URL: process.env.APP_URL || 'http://localhost:5000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 27017,
  DB_NAME: process.env.DB_NAME || 'blogdb',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // External Services
  MAIL_SERVICE: process.env.MAIL_SERVICE || 'gmail',
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};

// Validation: Check required variables at startup
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredVars.forEach(varName => {
  if (!config[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Freeze config to prevent modifications at runtime
module.exports = Object.freeze(config);
```

**Create `src/config/logger.js`:**

```javascript
// src/config/logger.js
const pino = require('pino');
const config = require('./index');

const logger = pino({
  level: config.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      singleLine: false,
    },
  } : undefined,
});

module.exports = logger;
```

**Create `.env.example`:**

```env
# Application
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000

# Database (MongoDB)
DATABASE_URL=mongodb://localhost:27017/blogdb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=blogdb

# Redis
REDIS_URL=redis://localhost:6379

# JWT & Security
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d

# Logging
LOG_LEVEL=info

# Email Service (Gmail example)
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

### Step 1.5: Install Core Dependencies

```bash
# Core framework
npm install express

# Configuration & environment
npm install dotenv

# Logging
npm install pino pino-pretty

# Database
npm install mongoose

# Caching
npm install redis

# Validation
npm install joi zod

# Security
npm install jsonwebtoken helmet cors express-rate-limit

# Development
npm install --save-dev nodemon jest @testing-library/node

# Linting
npm install --save-dev eslint prettier eslint-config-prettier
```

---

## Phase 2: Core Development

### Step 2.1: Set Up Express Application

**Create `src/app.js`:**

```javascript
// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./config/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Routes (will be added in next steps)
app.use('/api/users', require('./routes/user'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/explore', require('./routes/explore'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
});

module.exports = app;
```

**Create `src/server.js`:**

```javascript
// src/server.js
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const mongoose = require('mongoose');

// Database connection
mongoose.connect(config.DATABASE_URL)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection failed:', err));

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(`Server running on ${config.APP_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});
```

### Step 2.2: Create Controllers, Services, and Models

**Example: User Controller**

```javascript
// src/controllers/user/createUser.js
const userService = require('../../services/userService');
const logger = require('../../config/logger');

const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validation (optional, can use middleware)
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await userService.createUser({ email, password, name });
    
    res.status(201).json({
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    next(error);
  }
};

module.exports = { createUser };
```

**Example: User Service**

```javascript
// src/services/userService.js
const User = require('../models/User');
const logger = require('../config/logger');

const userService = {
  async createUser(data) {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = await User.create(data);
      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Service error:', error.message);
      throw error;
    }
  },

  async getUserById(id) {
    return User.findById(id);
  },

  async getAllUsers() {
    return User.find();
  },
};

module.exports = userService;
```

### Step 2.3: Implement Validators

**Create validators for request validation:**

```javascript
// src/validators/userValidator.js
const Joi = require('joi');

const userValidator = {
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required(),
  }),

  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = userValidator;
```

### Step 2.4: Create Routes

**Create API routes:**

```javascript
// src/routes/user.js
const express = require('express');
const { createUser } = require('../controllers/user/createUser');
const userValidator = require('../validators/userValidator');

const router = express.Router();

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};

router.post('/', validate(userValidator.createUser), createUser);

module.exports = router;
```

---

## Phase 3: Testing & Quality

### Step 3.1: Set Up Jest for Testing

**Create `jest.config.js`:**

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
};
```

### Step 3.2: Write Unit Tests

**Example: `tests/unit/services/userService.test.js`**

```javascript
const userService = require('../../../src/services/userService');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe('User Service', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(userData);

      const result = await userService.createUser(userData);

      expect(result).toEqual(userData);
      expect(User.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error if user exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      User.findOne.mockResolvedValue(userData);

      await expect(userService.createUser(userData)).rejects.toThrow('User already exists');
    });
  });
});
```

### Step 3.3: Set Up ESLint

**Create `.eslintrc.js`:**

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
};
```

### Step 3.4: Run Tests & Linting

```bash
# Run tests
npm test

# Check coverage
npm test -- --coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## Phase 4: Security Hardening

### Step 4.1: Add Security Headers

Already covered in `app.js` with `helmet`. Verify:
```bash
npm install helmet
```

### Step 4.2: Implement Authentication

**Create `src/middleware/auth.js`:**

```javascript
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth error:', error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

### Step 4.3: Rate Limiting

**Update `src/app.js` with rate limiting:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);
```

### Step 4.4: Input Sanitization

```bash
npm install express-mongo-sanitize xss-clean
```

**Update `src/app.js`:**

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS
```

### Step 4.5: Environment Variable Validation

Already done in `src/config/index.js`. Verify all required vars are checked at startup.

---

## Phase 5: Containerization

### Step 5.1: Create Production Dockerfile

**Create `docker/Dockerfile`:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "src/server.js"]
```

### Step 5.2: Create Development Dockerfile

**Create `docker/Dockerfile.dev`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

### Step 5.3: Create .dockerignore

**Create `docker/.dockerignore`:**

```
node_modules
npm-debug.log
dist
.env
.env.local
.git
.gitignore
README.md
.DS_Store
.vscode
.idea
logs
coverage
tests
.github
infra
```

### Step 5.4: Build & Test Docker Image

```bash
# Build production image
docker build -f docker/Dockerfile -t blogging-app:latest .

# Build development image
docker build -f docker/Dockerfile.dev -t blogging-app:dev .

# Test production image
docker run --rm \
  -e NODE_ENV=production \
  -e DATABASE_URL=mongodb://mongo:27017/blogdb \
  -e JWT_SECRET=test-secret \
  -p 5000:5000 \
  blogging-app:latest

# Test health endpoint
curl http://localhost:5000/health
```

---

## Phase 6: Infrastructure & Deployment

### Step 6.1: Create GitHub Actions Workflows

**Create `.github/workflows/test.yml`:**

```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongo:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: mongodb://localhost:27017/test_blogdb
          JWT_SECRET: test-secret
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**Create `.github/workflows/build.yml`:**

```yaml
name: Build & Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/blogging-app:latest
            ${{ secrets.DOCKER_REGISTRY }}/blogging-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Step 6.2: Create Kubernetes Manifests

**Create `infra/kubernetes/deployment.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blogging-app
  namespace: production

spec:
  replicas: 3
  
  selector:
    matchLabels:
      app: blogging-app
  
  template:
    metadata:
      labels:
        app: blogging-app
    spec:
      containers:
        - name: blogging-app
          image: your-registry/blogging-app:latest
          imagePullPolicy: Always
          
          ports:
            - name: http
              containerPort: 5000
              protocol: TCP
          
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "5000"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: jwt-secret
            - name: LOG_LEVEL
              value: "info"
          
          livenessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 15
            periodSeconds: 20
            timeoutSeconds: 3
            failureThreshold: 3
          
          readinessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 2
          
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          
          securityContext:
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            allowPrivilegeEscalation: false

      securityContext:
        fsGroup: 1001
```

**Create `infra/kubernetes/service.yaml`:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: blogging-app-service
  namespace: production

spec:
  type: LoadBalancer
  
  selector:
    app: blogging-app
  
  ports:
    - name: http
      port: 80
      targetPort: 5000
      protocol: TCP
```

### Step 6.3: Deploy to Production

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=jwt-secret=$JWT_SECRET \
  -n production

# Apply manifests
kubectl apply -f infra/kubernetes/deployment.yaml
kubectl apply -f infra/kubernetes/service.yaml

# Check deployment status
kubectl get deployments -n production
kubectl get pods -n production
kubectl get svc -n production
```

---

## Phase 7: Monitoring & Operations

### Step 7.1: Add Health Check Endpoint

Already implemented in `src/app.js`. Extend it:

```javascript
// src/routes/health.js
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await mongoose.connection.db.admin().ping();
    const redisStatus = await redis.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus.ok === 1 ? 'ok' : 'failed',
        cache: redisStatus === 'PONG' ? 'ok' : 'failed',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

### Step 7.2: Implement Logging

Already done with Pino. Extend with structured logging:

```javascript
// In services and controllers
logger.info({
  action: 'user_created',
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
});
```

### Step 7.3: Set Up Error Tracking

```bash
npm install @sentry/node
```

**Add to `src/app.js`:**

```javascript
const Sentry = require('@sentry/node');

if (config.NODE_ENV === 'production') {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}
```

### Step 7.4: Add APM (Application Performance Monitoring)

Consider tools like:
- Datadog
- New Relic
- Elastic APM
- Prometheus

Basic Prometheus example:

```bash
npm install prom-client
```

---

## Phase 8: Post-Deployment

### Step 8.1: Database Migration Strategy

**Create `scripts/migrate.js`:**

```javascript
// scripts/migrate.js
const mongoose = require('mongoose');
const config = require('../src/config');

async function migrate() {
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log('Connected to database');

    // Run migrations here
    // Example: Create indexes
    const User = require('../src/models/User');
    await User.collection.createIndex({ email: 1 }, { unique: true });

    console.log('Migrations completed');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

**Update `package.json`:**

```json
{
  "scripts": {
    "migrate": "node scripts/migrate.js"
  }
}
```

### Step 8.2: Backup & Recovery

- Set up automated MongoDB backups (hourly/daily)
- Test recovery procedures monthly
- Document recovery runbook

### Step 8.3: Monitoring Checklist

- [ ] Error rate alerts (threshold: > 1%)
- [ ] Response time alerts (p99 > 500ms)
- [ ] CPU usage alerts (> 80%)
- [ ] Memory usage alerts (> 80%)
- [ ] Database connection pool alerts
- [ ] Disk space alerts

### Step 8.4: Security Checklist

- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets rotated regularly
- [ ] Security headers present (HSTS, CSP, X-Frame-Options)
- [ ] Dependencies updated and scanned

**Run security audit:**

```bash
npm audit
npm audit fix
npm outdated
```

### Step 8.5: Performance Optimization

```bash
# Monitor performance
npm install clinic

clinic doctor -- node src/server.js
clinic flame -- node src/server.js
```

### Step 8.6: Create Runbook

**Create `RUNBOOK.md` documenting:**

1. **Deployment Procedure**
   - Pre-deployment checklist
   - Deployment steps
   - Post-deployment verification

2. **Incident Response**
   - Common issues and solutions
   - Rollback procedure
   - Escalation contacts

3. **Monitoring Dashboards**
   - Key metrics and where to find them
   - Alert thresholds and response actions

4. **Scaling Strategy**
   - When and how to scale
   - Resource requirements

5. **Maintenance Windows**
   - Database maintenance schedule
   - Dependency updates
   - Security patches

---

## Quick Reference: Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Check lint issues
npm run lint

# Fix lint issues
npm run lint:fix
```

### Before Committing

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Check dependencies
npm audit

# Commit
git add .
git commit -m "Descriptive commit message"
```

### Release to Production

```bash
# Pull latest changes
git pull origin main

# Run full test suite
npm test -- --coverage

# Build Docker image
docker build -f docker/Dockerfile -t blogging-app:v1.0.0 .

# Push to registry
docker push your-registry/blogging-app:v1.0.0

# Deploy to Kubernetes
kubectl set image deployment/blogging-app blogging-app=your-registry/blogging-app:v1.0.0 -n production

# Verify deployment
kubectl rollout status deployment/blogging-app -n production

# Monitor logs
kubectl logs -f deployment/blogging-app -n production
```

---

## Common Issues & Solutions

### Issue: Application crashes after deployment
**Solution:**
1. Check application logs: `kubectl logs <pod-name>`
2. Verify environment variables are set
3. Check database connectivity
4. Review recent code changes

### Issue: High memory usage
**Solution:**
1. Check for memory leaks in event listeners
2. Review large data structures in memory
3. Implement caching/pagination
4. Use memory profiler: `clinic`

### Issue: Slow database queries
**Solution:**
1. Add indexes to frequently queried fields
2. Optimize query selection
3. Implement query pagination
4. Use database query profiler

### Issue: High error rate after deployment
**Solution:**
1. Check application logs immediately
2. Verify all dependencies are compatible
3. Check external service connectivity
4. Rollback if critical issues found

---

## Summary

This guide covers:
1. ✅ Setting up a proper project structure
2. ✅ Implementing core features professionally
3. ✅ Comprehensive testing strategy
4. ✅ Security hardening
5. ✅ Containerization with Docker
6. ✅ Infrastructure as Code (Kubernetes)
7. ✅ CI/CD automation
8. ✅ Monitoring and operations
9. ✅ Post-deployment best practices

**Next Steps:**
- Implement this step-by-step
- Test thoroughly at each phase
- Set up monitoring before production
- Document your specific procedures
- Create team runbooks and playbooks

---

**Remember:** Production readiness is not a destination but a continuous process. Always improve, monitor, and iterate.
