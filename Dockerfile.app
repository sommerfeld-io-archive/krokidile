## Dockerfile for a Node.js application
## This Dockerfile is based on the official Node.js image
## and copies the application code into the image
## and installs the dependencies
## and starts the application
##
## == How to use
## Build the Docker image using the following command: `docker build --no-cache  -t local/krokidile:dev -f Dockerfile.app .`
##
## Use `docker run --rm -p "3000:9000" sommerfeldio/krokidile:rc` to run the most
## recent release candidate from DockerHub.
##
## @see docker-compose.yml

FROM node:22.2.0-alpine3.20
LABEL maintainer="sebastian@sommerfeld.io"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app

EXPOSE 9000
CMD ["npm", "start-dev-server"]
