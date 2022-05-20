FROM node:16 as builder
WORKDIR /project
ADD ./package.json .
RUN npm i
ADD . .
RUN npm run build:server

FROM node:16

COPY --from=builder /project/server/ /server/
WORKDIR /server
ENTRYPOINT node server.js
