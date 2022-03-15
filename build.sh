#!/bin/bash

git pull

docker stop rtmp-stream-app

docker rm rtmp-stream-app

docker build -t rtmp-stream-app:latest .

docker run -d -p 1935:1935 -p 3000:3000 --name rtmp-stream-app rtmp-stream-app:latest

echo "Build Successfully"
