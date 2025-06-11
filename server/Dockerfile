# Use official Node.js image as the base
FROM node:22-slim AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm i --production

# Copy the rest of the app's source code
COPY . .

FROM node:22-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 3000
CMD ["node", "server.js"]
