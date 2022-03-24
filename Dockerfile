# Base Image
FROM node:lts-alpine as node

WORKDIR /app

RUN apk add ffmpeg
RUN ffmpeg -h

COPY ./ /app/
COPY .env ./

RUN npm install ci
RUN npm run build

EXPOSE 3000
EXPOSE 1935
CMD ["npm", "run", "start:prod"]
# docker build -t rtmp-stream-app:latest .
# docker run -d -p 3000:3000 -p 1935:1935 rtmp-stream-app:latest
