FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the MartinLayers backend API."
LABEL maintainer = ["flavidev@gmail.com"]

WORKDIR /app

COPY package.json .

RUN yarn install --production

COPY . .

EXPOSE 3333

CMD ["yarn", "start"]