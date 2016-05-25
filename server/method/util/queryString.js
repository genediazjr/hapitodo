'use strict';

const Iron = require('iron');
const Config = require('../../config');
const qsKey = Config.get('/qsKey');
const secret = Config.get('/iron/secret');
const options = Config.get('/iron/options');

exports.build = (params, next) => {

    if (!params) {

        return next();
    }

    return Iron.seal(params, secret, options, (err, sealed) => {

        if (err) {

            return next({
                code: 'querystring_build_error',
                message: 'Unable to build query string'
            });
        }

        return next(null, '/?' + qsKey + '=' + sealed);
    });
};


exports.parse = (query, next) => {

    if (!query || !query[qsKey]) {

        return next();
    }

    return Iron.unseal(query[qsKey], secret, options, (err, unsealed) => {

        if (err) {

            return next({
                code: 'querystring_parse_error',
                message: 'Unparsable query string'
            });
        }

        return next(null, unsealed);
    });
};
