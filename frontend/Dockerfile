FROM node:alpine

LABEL version="1.0"
LABEL description="This is the base docker image for the MartinLayers frontend react app."
LABEL maintainer = ["flavidev@gmail.com"]

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]