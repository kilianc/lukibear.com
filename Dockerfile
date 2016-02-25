FROM kilianciuffolo/http-server:5.5.0
MAINTAINER kilian@lukibear.com

WORKDIR /website
COPY package.json ./
RUN npm install && npm cache clean

COPY . ./
RUN $(npm bin)/gulp
CMD ["release", "-c31536000"]
