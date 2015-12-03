# boilerplate
FROM kilianciuffolo/node:4.2.2
MAINTAINER kilian@lukibear.com

# app
WORKDIR /website
COPY package.json ./
RUN npm install && npm cache clean

COPY . ./
RUN node_modules/.bin/gulp
CMD ["node", "--harmony", "server"]
EXPOSE 8080
