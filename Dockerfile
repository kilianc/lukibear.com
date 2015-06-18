# boilerpale
FROM kilianciuffolo/static
MAINTAINER me@nailik.org

# app
WORKDIR /app
ADD app ./
ADD CHECKS ./