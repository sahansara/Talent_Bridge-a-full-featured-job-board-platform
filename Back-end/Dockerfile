# Use official Node LTS image
FROM node:20


RUN npm install -g nodemon

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./


# For production: install only production deps
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --only=production && npm cache clean --force; \
    else \
      npm install && npm cache clean --force; \
    fi

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command based on environment
CMD if [ "$NODE_ENV" = "production" ]; then \
      node index.js; \
    else \
      npm run start; \
    fi