# Use lightweight Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies (production only to keep image small)
# Note: If you need devDependencies (like nodemon) for dev mode in docker-compose, 
# you might want strictly 'npm install' or multi-stage builds.
# For this simple setup, we'll install everything to support 'npm run dev' if needed.
RUN npm install

# Copy application source code
COPY . .

# Expose the port the app runs on
EXPOSE 2000

# Default command (can be overridden in docker-compose)
CMD ["npm", "start"]
