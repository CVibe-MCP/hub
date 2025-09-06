# Multi-stage Docker build for Next.js Hub application
FROM node:18-alpine AS base

# Install security updates and dumb-init
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app directory with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app
RUN chown -R nodeuser:nodejs /app

# Copy package files
COPY --chown=nodeuser:nodejs package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

###########################################
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

###########################################
FROM base AS runtime

# Copy built application from build stage
COPY --from=build --chown=nodeuser:nodejs /app/.next ./.next
COPY --from=build --chown=nodeuser:nodejs /app/public ./public
COPY --from=build --chown=nodeuser:nodejs /app/package.json ./

# Copy Next.js static files (cache not needed for production)

# Create non-root user for security
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling in Kubernetes
ENTRYPOINT ["dumb-init", "--"]

# Start the Next.js application
CMD ["npm", "start"]
