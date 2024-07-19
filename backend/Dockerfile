FROM node:18

WORKDIR /app

# Install necessary build tools and libraries
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Install Prisma CLI globally
RUN npm install -g prisma

# Generate Prisma client
RUN npx prisma generate

# Expose port for the application
EXPOSE 3001

# Copy the rest of the application files
COPY . .

# Copy and set the entrypoint script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Use the entrypoint script
CMD ["/start.sh"]