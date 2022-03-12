FROM tiangolo/nginx-rtmp

COPY nginx.conf /etc/nginx/nginx.conf

# docker build -t rtmp-stream-app:latest .
# docker run -d -p 1935:1935 -p 3000:3000 --name rtmp-stream-app rtmp-stream-app:latest
