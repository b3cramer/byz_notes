# Dockerfile for Byzantine Paralage App
# Multi-stage build for optimized static site serving

#####################################################################
# Stage 1: Build the React application
#####################################################################
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (including lock file)
COPY app/package.json app/package-lock.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy application source
COPY app/ ./

# Build the application
RUN npm run build

#####################################################################
# Stage 2: Serve with nginx
#####################################################################
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
