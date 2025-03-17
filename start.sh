#!/bin/bash

# Kill any existing ngrok processes
pkill ngrok || true

# Wait for ngrok to fully terminate
sleep 2

# Create required directories
mkdir -p src/uploads src/logs src/backups

# Set permissions
chmod 777 src/uploads src/logs src/backups

# Load environment variables
source .env

# Start ngrok with fixed domain and token in the background
ngrok http --domain=$NGROK_DOMAIN --authtoken=$NGROK_TOKEN --log=stdout --log-level=debug 3000 &

# Wait for ngrok to start and create the API interface
sleep 5

# Start the Node.js server
node src/app.js 