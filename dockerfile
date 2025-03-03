# Build stage
FROM node:21-alpine3.19 as base

# Set the working directory for our application inside the Docker container
WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of our application's source code to the Docker container
COPY . .

EXPOSE 8001

# The commands that will be run when the Docker container starts up. 
CMD ["npm", "run", "start", "dev"]

