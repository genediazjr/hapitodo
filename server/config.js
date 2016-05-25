'use strict';

const Confidence = require('confidence');

const defaultCriteria = {
    env: process.env.NODE_ENV
};

const config = {
    $meta: 'This file configures the plot device.',
    qsKey: 'a',
    apiPrefix: 'api',
    mongodb: {
        host: '127.0.0.1',
        port: 27017
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        database: 0
    },
    iron: {
        secret: 'requiredthirtytwoinlengthpassphrase',
        options: {
            encryption: {
                saltBits: 256,
                algorithm: 'aes-256-cbc',
                iterations: 1,
                minPasswordlength: 32
            },
            integrity: {
                saltBits: 256,
                algorithm: 'sha256',
                iterations: 1,
                minPasswordlength: 32
            },
            ttl: 0,
            timestampSkewSec: 60,
            localtimeOffsetMsec: 0
        }
    }
};

const store = new Confidence.Store(config);


exports.get = (key, criteria) => {

    return store.get(key, criteria || defaultCriteria);
};


exports.meta = (key, criteria) => {

    return store.meta(key, criteria || defaultCriteria);
};
