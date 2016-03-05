FROM kilianciuffolo/http-server:5.7.1
MAINTAINER kilian@lukibear.com

ARG NODE_ENV=development

WORKDIR /website
COPY package.json ./
RUN npm install --only="dev" && npm cache clean

COPY . ./
RUN $(npm bin)/gulp
CMD ["release", "-c31536000"]
