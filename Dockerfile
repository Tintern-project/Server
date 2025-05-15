# Dockerfile for NestJS Server on Fly.io
FROM node:20-alpine AS Builder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm install --legacy-peer-deps

# Explicitly install mongoose and its types
RUN npm install mongoose
RUN npm install --save-dev @types/mongoose

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS Production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production --legacy-peer-deps && \
    npm install mongoose

# Copy built application from builder stage
COPY --from=Builder /app/dist ./dist
COPY --from=Builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables explicitly
ENV PORT=8080
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "dist/main"]
