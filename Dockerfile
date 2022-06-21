FROM node:18.2.0-alpine3.15 AS dev
WORKDIR app
COPY package*.json ./
RUN npm i -g @quasar/cli
RUN npm install
COPY . .


FROM dev as builder
RUN quasar build

FROM builder as server
ENTRYPOINT quasar serve dist/spa -p 8000 --history
