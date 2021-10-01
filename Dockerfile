FROM node:16-alpine3.14

RUN npm install

RUN npx tsc -b

COPY --chown=node:node . .

CMD [ "node", "." ]
