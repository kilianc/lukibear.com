FROM kilianciuffolo/http-server:5.6.0
MAINTAINER kilian@lukibear.com

ARG NODE_ENV=development

WORKDIR /website
COPY package.json ./
RUN npm install && npm cache clean

COPY . ./
RUN $(npm bin)/gulp
CMD ["release", "-c31536000"]
