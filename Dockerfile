FROM node:18.2.0-alpine3.15 AS dev
WORKDIR app
COPY package*.json ./
RUN npm i -g @quasar/cli
COPY . .


FROM dev as builder
RUN npm install
RUN quasar build

FROM builder as server
ENTRYPOINT quasar serve dist/spa -p 8000 --history
