# Use official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the frontend code into the container
COPY . /app/

# Build the React app
RUN npm run build

# Install a simple web server to serve the React app
RUN npm install -g serve

# Expose the port React app will run on
EXPOSE 3000

# Command to start the server and serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
