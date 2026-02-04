FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend code
COPY . .

# Expose React port
EXPOSE 3000

# Start frontend
CMD ["npm", "run", "dev"]