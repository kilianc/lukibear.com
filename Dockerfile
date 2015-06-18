# boilerpale
FROM kilianciuffolo/node:0.12.4
MAINTAINER me@nailik.org

RUN npm install -g http-server

CMD ["http-server"]
EXPOSE 8080

# app
WORKDIR /app
ADD app ./
ADD CHECKS ./