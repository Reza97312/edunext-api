FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5050

CMD ["npm", "start"]