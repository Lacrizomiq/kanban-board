#!/bin/sh

# Run any pending migrations
npx prisma migrate deploy

# Start the application using nodemon
npx nodemon src/app.js