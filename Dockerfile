# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port (default 3000, can be overridden by environment variable)
EXPOSE ${PORT:-3000}

# Start the development server
CMD ["npm", "run", "dev"]
