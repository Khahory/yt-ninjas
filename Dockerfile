# Stage 1: Build the application
FROM node:20.11.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Test multiple stage
RUN touch builder.txt

## Stage 2: Create the final image
FROM node:20.11.0-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN apk add --no-cache curl bash

CMD node dist/index.js
