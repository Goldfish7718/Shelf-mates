#!/bin/bash

# Array of URLs to ping
URLS=(
  "https://shelf-mates-proxy.onrender.com/health"
  "https://shelf-mates-server.onrender.com/health"
  "https://shelf-mates-agent-api.onrender.com"
)

echo "Starting service wake-up (cold restart triggers)..."
echo "------------------------------------------------"

for url in "${URLS[@]}"; do
  echo "Pinging: $url"
  # -s: silent mode
  # -o /dev/null: discard response body
  # -w: output the HTTP status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "Response Status Code: $status_code"
  echo "------------------------------------------------"
done

echo "Wake-up calls finished!"
