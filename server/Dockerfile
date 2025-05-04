# Use Node.js LTS version
FROM node:20-alpine

# Install required dependencies for sharp
RUN apk add --no-cache python3 make g++ vips-dev

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing sharp installation
RUN npm uninstall sharp

# Install dependencies and rebuild sharp for Alpine
RUN npm install --platform=linux --arch=x64 --libc=musl
RUN npm rebuild sharp

# Bundle app source
COPY . .

# Create necessary directories
RUN mkdir -p public/profilepic log

# Set permissions for directories
RUN chmod -R 755 public log

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]