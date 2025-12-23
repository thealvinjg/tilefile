# Use Node.js for building the app
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (to cache npm install)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Run the development server
# --host 0.0.0.0 is crucial! It lets Docker map the port to your physical machine.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]