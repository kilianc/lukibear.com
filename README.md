# lukibear.com

### Install and initial setup

    $ node -v
    v5.7.1
    $ npm install
    $ $(npm bin)/gulp serve

This will spin up a local server with [livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).

### Create and test release version

    $ $(npm bin)/gulp
    $ http-server

Navigate to http://127.0.0.1:8080/release

### Docker

This website is deployed using a `Dockerfile` included in this repo. If you want to check that everything is working properly you can build and run the image yourself. If you need guidance on how to install docker you can read here: https://docs.docker.com/machine/install-machine/

    $ npm run docker-build
    $ npm run docker-run

### Deploy

Then deploy every time to dev (https://dev.lukibear.com/) with:

    $ npm run deploy-dev

or to prod (https://lukibear.com/) with:

    $ npm run deploy-prod
