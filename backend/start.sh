#!/bin/sh

echo "Starting entrypoint script..."

# Run any pending migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application using nodemon
echo "Starting application with nodemon..."
npx nodemon src/app.js