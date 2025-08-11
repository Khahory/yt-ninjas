# Stage 1: Build the application
FROM node:20.11.0-alpine as builder

# production, staging
ARG ENV_CONFIGURATION
ENV ENV_CONFIGURATION=${ENV_CONFIGURATION}

WORKDIR /app

COPY . .

RUN npm i --location=global @angular/cli@18.0.4 && \
    npm install

# Build the application
RUN ng build --configuration $ENV_CONFIGURATION

# Stage 2: Create the final image
FROM node:20.11.0-alpine

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY server.js .
RUN npm install express@4.19.2
EXPOSE 3000
CMD ["node", "server.js"]

#ENTRYPOINT ["sh", "-c", "while true; do sleep 1; done"]

# docker build -t stage/pos-amadita --build-arg ENV_CONFIGURATION=development -f Dockerfile .
# docker run -p 9090:3000 stage/pos-amadita

# Para ECR
# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 892199400313.dkr.ecr.us-east-1.amazonaws.com
# docker buildx build --platform linux/amd64 -t stage/pos-amadita . --build-arg ENV_CONFIGURATION=development
# docker build -t stage/pos-amadita . --build-arg ENV_CONFIGURATION=development
# docker tag stage/pos-amadita:latest 892199400313.dkr.ecr.us-east-1.amazonaws.com/stage/pos-amadita:latest
# docker push 892199400313.dkr.ecr.us-east-1.amazonaws.com/stage/pos-amadita:latest
