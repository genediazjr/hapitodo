# Hapi To Do
[Demo](https://hapitodo.herokuapp.com/) of a [TodoMVC](http://todomvc.com/) front-end with a [Hapi](http://hapijs.com/) back-end.

[![Build Status](https://travis-ci.org/genediazjr/hapitodo.svg)](https://travis-ci.org/genediazjr/hapitodo)
[![Coverage Status](https://coveralls.io/repos/genediazjr/hapitodo/badge.svg)](https://coveralls.io/r/genediazjr/hapitodo)
[![Code Climate](https://codeclimate.com/github/genediazjr/hapitodo/badges/gpa.svg)](https://codeclimate.com/github/genediazjr/hapitodo)
[![Known Vulnerabilities](https://snyk.io/test/github/genediazjr/hapitodo/badge.svg)](https://snyk.io/test/github/genediazjr/hapitodo)
[![NSP Status](https://nodesecurity.io/orgs/genediazjr/projects/7c6fd452-5999-4656-93cc-c949de1ece85/badge)](https://nodesecurity.io/orgs/genediazjr/projects/7c6fd452-5999-4656-93cc-c949de1ece85)

## Setup
```bash
$ git clone https://github.com/genediazjr/hapitodo.git && cd hapitodo
$ npm install            # download dependencies
$ npm start              # run server (uses json as db)
$ npm test               # run test script
$ npm run precompile     # precompile templates
$ npm run postgres       # run server (uses postgre)
```
You may modify the postgre connection string on the manifest.

## Contributing
* Submit an issue first for significant changes.
* Follow the [Hapi styleguide](http://hapijs.com/styleguide).
* Include 100% test coverage.
