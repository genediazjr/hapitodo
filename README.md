# Hapi To Do  
[Hapi] (http://hapijs.com/) CRUD Boilerplate in a To Do [Demo] (https://hapitodo.herokuapp.com/) that works with and without client javascript. **WIP**

[![Build Status](https://travis-ci.org/genediazjr/hapitodo.svg)](https://travis-ci.org/genediazjr/hapitodo)
[![Coverage Status](https://coveralls.io/repos/genediazjr/hapitodo/badge.svg)](https://coveralls.io/r/genediazjr/hapitodo)
[![Code Climate](https://codeclimate.com/github/genediazjr/hapitodo/badges/gpa.svg)](https://codeclimate.com/github/genediazjr/hapitodo)
[![Known Vulnerabilities](https://snyk.io/test/github/genediazjr/hapitodo/badge.svg)](https://snyk.io/test/github/genediazjr/hapitodo)

## Setup
```bash
$ npm install
$ npm start
```
Run tests
```bash
$ npm test
```

## Structure
```
/server
├─ /route     - hapi routes
│  ├─ /rest   - restful routes
│  └─ /web    - browser routes
└─ /method    - hapi methods
   ├─ /event  - dispatcher
   ├─ /model  - data access
   └─ /util   - helpers
/static       - asset files
└─ /mold      - view templates
/test
```

## Technologies
* [hapijs] (https://github.com/hapijs/hapi) - server framework
* [handlebars] (https://github.com/wycats/handlebars.js) - view templates
* [async] (https://github.com/caolan/async) - async util
* [lodash] (https://github.com/lodash/lodash) - js util
* [hashids] (https://github.com/ivanakimov/hashids.node.js) - hashid util
* [uuid] (https://github.com/broofa/node-uuid) - uuid generator
* [bcrypt] (https://github.com/ncb000gt/node.bcrypt.js) - blowfish encryption
* [msgpack] (https://github.com/mcollina/msgpack5) - binary serialization
* [redis] (https://github.com/luin/ioredis) - memory datastore
* [mongodb] (https://github.com/mongodb/node-mongodb-native) - disk datastore
* [proxyquire] (https://github.com/thlorenz/proxyquire) - dependency proxy
* [jscs] (https://github.com/jscs-dev/node-jscs) - code style
* [jshint] (https://github.com/jshint/jshint) - code analysis

## Hapi Plugins
* [acquaint] (https://github.com/genediazjr/acquaint) - autoload routes, handlers, and methods
* [good] (https://github.com/hapijs/good) - server metrics
* [good-squeeze] (https://github.com/hapijs/good-squeeze) - event filter
* [good-console] (https://github.com/hapijs/good-console) - console logging
* [catbox-redis] (https://github.com/hapijs/catbox-redis) - redis cache
* [catbox-mongodb] (https://github.com/hapijs/catbox-mongodb) - mongodb cache
* [vision] (https://github.com/hapijs/vision) - template rendering
* [visionary] (https://github.com/hapijs/visionary) - views autoload 
* [confidence] (https://github.com/hapijs/confidence) - config util
* [scooter] (https://github.com/hapijs/scooter) - user agent tool
* [blankie] (https://github.com/nlf/blankie) - csp tool
* [crumb] (https://github.com/hapijs/crumb) - csrf tool
* [inert] (https://github.com/hapijs/inert) - static handler
* [wreck] (https://github.com/hapijs/wreck) - http util
* [hoek] (https://github.com/hapijs/hoek) - hapi util
* [glue] (https://github.com/hapijs/glue) - server composer
* [boom] (https://github.com/hapijs/boom) - error objects
* [shot] (https://github.com/hapijs/shot) - fake http
* [code] (https://github.com/hapijs/code) - assertion util
* [lab] (https://github.com/hapijs/lab) - test util
* [joi] (https://github.com/hapijs/joi) - schema validation

## Contributing
* Include 100% test coverage
* Follow the [Hapi coding conventions] (http://hapijs.com/styleguide)
* Submit an issue first for significant changes.

## Credits
* [hapi-frame] (https://github.com/jedireza/frame) - hapi api
* [hapi-ninja] (https://github.com/poeticninja/hapi-ninja) - hapi + swig
* [hapi-router] (https://github.com/bsiddiqui/hapi-router) - route autoload
* [hapi-handlers] (https://github.com/ar4mirez/hapi-handlers) - handler autoload
* [hapi-methods-injection] (https://www.npmjs.com/package/hapi-methods-injection) - method autoload
* [Manifests, plugins and schemas: Organizing your hapi application] (https://medium.com/@dstevensio/manifests-plugins-and-schemas-organizing-your-hapi-application-68cf316730ef)

## Todo.. Todo.. Todo todo todo todo todoooooo
* authentication and authorization
* restful client javascript
* use of validations
* list pagination
* tests, tests, tests, and tests
