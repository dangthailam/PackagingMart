# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY index.html ./
COPY server.js ./
COPY products*.json ./

# Expose port (Railway will set PORT environment variable)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
