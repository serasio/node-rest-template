# Node.js API template

## Bootstrapping

- Read the rest of this README.md
- Follow the `Start project` section
- Run the tests
- Start the server

After all is setup & running, feel free to remove the local git repository and initialize a new one,
rename databases, and remove the sample source code.

## Stack

This section is going to show a curated list of the packages and tools used for this project (to see
the full list of dependencies take a look at `package.json`)

* [Koa](https://koajs.com/)
* [Koa Router](https://github.com/koajs/router)
* [Koa CORS](https://github.com/koajs/cors)
* [Koa Passport](https://github.com/rkusa/koa-passport)
* [Koa Bodyparser](https://github.com/koajs/bodyparser)
* [Objection.js](https://vincit.github.io/objection.js/)
* [knex](http://knexjs.org/)
* [Jest](https://jestjs.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Git](https://git-scm.com/)

# Start project

## Start project with docker (recommended)

In order to start the project with docker you just need to execute the following script (you should
have docker already installed and working on your machine)

```
./bin/start
```

The script assumes that you have a `.env.sample` file that file is going to be copied to a file
with the name `.env` and it's going to be used to start the application

## Start project manually

The following files needs to be copied and modified accordingly

```
$ cp .env.sample .env
```

After copy those files edit them to have the right values (ask a teammate if you don't know any of
those values), then you will need to create the database to do Postres is required to be up and
running (if you have it you can avoid the installation instructions for Postgres)

### Install tools

#### PostgreSQL

The easiest way to install postres is using this [app](https://postgresapp.com/), just follow the
instructions on their site and you will be ready to go (you might need to reload the terminal
to have access to postgres app commands)

#### Version manager

To install all the tools required by the project you need a tool to manage the version of
the tools. Using `asdf-vm` you can install all the tools, to install it you need to
follow the instructions on https://asdf-vm.com/

#### Node.js

If you want to manage node versions using asdf you need to install a plugin that is able to install
the different node versions, to do that just type the following command

```
$ asdf plugin add nodejs
```

And then to install nodejs run the following command

```
$ asdf install nodejs 14.0.0
```


### Install project dependencies

```
$ yarn install
```

### Create database

Based on the information on the file `.env` (that you copy previously) create two
databases on for `test` and one for `development` to do that just run the following command

```
$ createdb node_template_development
$ createdb node_template_test
```

Make sure those names matches what you have on `.env`

### Start the project

```
$ yarn run dev
```

This command will start a dev server and every change that is made to the code is reflected on the
terminal, that is running the code.

By default it will start the server port 3000, if you need to start the server on a different port
use the following command instead.

```
$ yarn run dev -- -p [PORT]
```

Where [PORT] is the port that you want to use for running the server

## Usage

### Migrate and seed database

If you are running the project with **docker**, first you need to enter to the terminal (inside the
container), to do that just type the following command on your shell:

```
$ ./bin/terminal
```

Once you are there you can use the following commands to either migrate or seed the database, for
none **docker** users just type the commands directly on the root of the project.

In order to have the latest schema on your database you need to run the following command:

```
$ npx knex migrate:latest
```

Then to create some seed data for development the following command could be run:

```
$ npx knex seed:run
```

### Scripts

### Code generators

- To generate an entity scaffold: `npx hygen generate scaffold`
- Make migration: `npx hygen generate migration`
- Make seed: `npx hygen generate seed`

### Running tests

To run the test just type the following command

```
$ yarn run test
```

### ESLint & Prettier

To run the linter and fix try to fix issues automatically run the following command

```
$ yarn run lint -- --fix
```

### Cleanup template files

The template has some example files like models, migrations, and tests for those models once you are
comfortable with the template you can execute the following script to clean up the template:

```
$ ./bin/cleanup
```

## Specific Documentation

- [Authentication](lib/authentication.md)
- [Serializer](lib/serializer.md)
- [Pagination](lib/middlewares.md)
