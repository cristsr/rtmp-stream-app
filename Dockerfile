# Base Image
FROM node:lts-alpine as node

WORKDIR /app

RUN apk add ffmpeg
RUN ffmpeg -h

COPY ./ /app/
COPY .env ./

RUN npm install ci
RUN npm run build

EXPOSE 6010
EXPOSE 6020
EXPOSE 1935
CMD ["npm", "run", "start:prod"]
# docker build -t rtmp-stream-app:latest .
# docker run -d -p 1935:1935 -p 6020:6020 -p 6010:6010 --name rtmp-stream-app rtmp-stream-app:latest
