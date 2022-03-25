#!/bin/bash

echo "Stop the old server"

docker stop rtmp-stream-app

echo "Remove the old server"

docker rm rtmp-stream-app

echo "Build the new server"

docker build -t rtmp-stream-app:latest .

echo "Run the new server"

docker run -d -p 1935:1935 -p 80:80 -p 443:443 --name rtmp-stream-app rtmp-stream-app:latest

echo "Build Successfully"
