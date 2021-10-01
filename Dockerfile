FROM node:16-alpine3.14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

RUN npx tsc -b

COPY --chown=node:node . .

CMD [ "node", "." ]
