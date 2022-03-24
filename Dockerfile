# Base Image
FROM node:lts-alpine as node

WORKDIR /app

COPY ./ /app/

RUN npm install ci

RUN npm run build

FROM node:lts-alpine as rtmp-stream-app

# Set working directory
WORKDIR /app

# Copy project files
COPY --from=node /app/package*.json ./
COPY --from=node /app/dist ./dist

# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install ci --only=production --ignore-scripts

# expose port and define CMD
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

# docker build -t rtmp-stream-app:latest .
# docker run -d -p 3000:3000 rtmp-stream-app:latest
