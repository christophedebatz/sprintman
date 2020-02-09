FROM node:alpine
MAINTAINER christophe de batz

RUN apk add --no-cache yarn
RUN yarn global add pm2

ARG ENV

RUN mkdir /app
WORKDIR /app

COPY ./dist ./dist
COPY pm2.json .
COPY package.json .
COPY yarn.lock .
COPY pm2.json .
COPY wait-for-it.sh .

RUN cd /app && chmod +x /app/wait-for-it.sh

RUN cd /app && yarn install --ignore-optional --production

EXPOSE 3001

ENTRYPOINT [ "pm2-runtime", "start", "--env", "$ENV", "pm2.json" ]
