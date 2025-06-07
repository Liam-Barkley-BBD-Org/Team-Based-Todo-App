# Use official Node.js image as the base
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the app's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
