# Use an official Node.js runtime as the parent image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install application dependencies
# If you are building your code for production, use `npm ci --only=production`
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Build the app
RUN npm run build

# Make the app's port available to the outside world 
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]