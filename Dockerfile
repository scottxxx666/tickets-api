FROM node:13.8.0-alpine3.11

COPY .env package.json yarn.lock ./src ./

RUN yarn install

EXPOSE 4000
CMD [ "node", "index.js" ]
