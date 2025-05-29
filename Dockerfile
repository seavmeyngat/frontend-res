# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Install a lightweight HTTP server to serve the app
RUN npm install -g serve

# Expose port
EXPOSE 3311

# Start the app
CMD ["serve", "-s", "dist", "-l", "3311"]
