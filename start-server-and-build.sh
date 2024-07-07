#!/bin/bash

# Start the Next.js server in the background
npm run start &

# Get the process ID of the server
SERVER_PID=$!

# Wait for the server to start (you may need to adjust the sleep duration)
echo "Waiting for the server to start..."
sleep 15

# Run the Next.js build process
next build

# Kill the server after the build is done
kill $SERVER_PID
