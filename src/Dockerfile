FROM node:13.8.0-alpine3.11

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "index.js" ]
