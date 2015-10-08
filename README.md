# lukibear.com

### Install and initial setup

    $ node -v
    v4.0.0
    $ npm install
    $ node_modules/.bin/gulp app

This will spin up a local server with [livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).

### Create and test dist version

    $ node_modules/.bin/gulp build:dist
    $ BASE=/dist node_modules/.bin/gulp app

### Docker

This website is deployed using a `Dockerfile` included in this repo. If you want to check that everything is working properly you can build and run the image yourself. If you need guidance on how to install docker you can read here: https://docs.docker.com/machine/install-machine/

    $ docker build -t lukibear-com .
    $ docker run --rm -p 8080:8080 --name lukibear-com lukibear-com
    $ open http://$(docker-machine ip default):8080
    $ docker stop lukibear-com

### Deploy

Only the first time

    $ git remote add dokku/dev dokku@git.lukibear.com:dev
    $ git remote add dokku/prod dokku@git.lukibear.com:lukibear.com

Then deploy every time to dev (https://dev.lukibear.com/) with:

    $ git push -f dokku/dev <yourbranch>:master

or to prod (https://lukibear.com/) with:

    $ git push -f dokku/prod <yourbranch>:master
