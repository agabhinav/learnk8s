FROM node:slim

WORKDIR /myapp

COPY package*.json ./

RUN npm install

COPY app.js .

CMD [ "node", "app.js" ]

EXPOSE 3000