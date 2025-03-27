# Use Node.js LTS as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "dev"]
