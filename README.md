# project-mate
------

A light weighted project planning app. Build on top of [MEAN stack](http://meanjs.org).
You can take a look of online [demo site](http://project-mate.herokuapp.com/), using guest credential `Demo@gmail.com` `pMate2014`

## Prerequisites
------

Install following for development:

* [Nodejs](https://nodejs.org/en/download/) as project backend framework and [npm](https://www.npmjs.com/) as package manager, this project was built and tested with node v0.10.29.
* [Bower](http://bower.io/) as frontend package manager.
* [MongoDB](http://www.mongodb.org/downloads) as database using default port 27017.
* [Grunt](http://gruntjs.com/) as dev task automation tool.
* [SASS](http://sass-lang.com/) as CSS pre-compiler, you'll need install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) first.

For a little more details about how to install them, please also refer to [MEANJS README](https://github.com/meanjs/mean).

## Install other dependencies
------

```
npm install

bower install
```

## Running application with Grunt
------

For development
```
grunt
```
Browsing at http://localhost:3000

For production
```
grunt prod
```

For test
```
grunt test
```

Configuration files can be found at `config/env`.
