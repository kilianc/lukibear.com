# boilerplate
FROM kilianciuffolo/static
MAINTAINER kilian@lukibear.com

# app
WORKDIR /website
COPY package.json ./
RUN npm install && npm cache clean

COPY . ./
RUN node_modules/.bin/gulp
CMD http-server dist
