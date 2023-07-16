# STAGE1: build client
FROM node:16.14.2-alpine as build-client

RUN mkdir -p /musify-client

COPY /client /musify-client

RUN npm ci
RUN npm run build

# STAGE2: build server

# STAGE3: tiny running image
