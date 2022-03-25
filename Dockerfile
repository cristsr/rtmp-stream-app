# Base Image
FROM node:lts-alpine as node

WORKDIR /app

RUN apk add ffmpeg
RUN ffmpeg -h

COPY ./ /app/
COPY .env ./

RUN npm install ci
RUN npm run build

EXPOSE 80
EXPOSE 443
EXPOSE 1935
CMD ["npm", "run", "start:prod"]
# docker build -t rtmp-stream-app:latest .
# docker run -d -p 80:80 -p 443:443 -p 1935:1935 rtmp-stream-app:latest
