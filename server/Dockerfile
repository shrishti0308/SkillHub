# Use Node.js LTS version (Debian-based)
FROM node:20

# Install required dependencies using apt-get
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libvips-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (standard install)
RUN npm install

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