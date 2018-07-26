FROM node:8-alpine

COPY index.js proxy.js package.json yarn.lock /
RUN yarn install --production=true

EXPOSE 3000
CMD node index.js
