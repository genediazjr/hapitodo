'use strict';

const Confidence = require('confidence');

const defaultCriteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        app: {},
        connections: {
            routes: {
                files: { relativeTo: process.cwd() + '/static' }
            },
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            }
        }
    },
    connections: [
        {
            port: process.env.PORT || 8888,
            labels: ['web']
        }
    ],
    registrations: [
        { plugin: 'inert' },
        { plugin: 'vision' },
        { plugin: 'scooter' },
        {
            plugin: {
                register: 'blankie',
                options: {
                    defaultSrc: 'self'
                }
            }
        },
        {
            plugin: {
                register: 'crumb',
                options: {
                    key: 'crumb',
                    size: 43,
                    restful: false,
                    autoGenerate: true,
                    addToViewContext: true,
                    cookieOptions: { clearInvalid: true }
                }
            }
        },
        {
            plugin: {
                register: 'visionary',
                options: {
                    path: 'static/mold',
                    partialsPath: 'static/mold/parts',
                    engines: { mustache: 'handlebars' }
                }
            }
        },
        {
            plugin: {
                register: 'acquaint',
                options: {
                    routes: [
                        {
                            includes: ['server/route/**/*.js']
                        }
                    ],
                    handlers: [
                        {
                            includes: ['server/handler/**/*.js']
                        }
                    ],
                    methods: [
                        {
                            prefix: 'event',
                            includes: ['server/method/event/**/*.js']
                        },
                        {
                            prefix: 'model',
                            includes: ['server/method/model/**/*.js']
                        },
                        {
                            prefix: 'util',
                            includes: ['server/method/util/**/*.js']
                        }
                    ]
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: { interval: 3600 * 1000 },
                    reporters: {
                        console: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{
                                    ops: '*',
                                    log: '*',
                                    error: '*',
                                    response: '*'
                                }]
                            },
                            { module: 'good-console' },
                            'stdout'
                        ]
                    }
                }
            }
        }
    ]
};

const store = new Confidence.Store(manifest);


exports.get = (key, criteria) => {

    return store.get(key, criteria || defaultCriteria);
};


exports.meta = (key, criteria) => {

    return store.meta(key, criteria || defaultCriteria);
};
