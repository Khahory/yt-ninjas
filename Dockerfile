# Stage 1: Build the application
FROM python:3.11.13-alpine3.22 AS builder

WORKDIR /app
RUN python -m venv venv
# copy
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Test multiple stage
RUN touch builder.txt

## Stage 2: Create the final image
FROM builder AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./

CMD node index.js
