'use strict';

const TodoRoute = require('../../server/route/todoRoute');
const testServer = require('../testServer')();

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const before = lab.before;
const describe = lab.describe;
const it = lab.it;

const object = '/todo';
const restapi = '/api/v1' + object;

let todoCreate = false;
let todoBrowse = false;
let todoRemove = false;
let todoUpdate = false;

let crumb;

testServer.handler('todoCreate', () => {

    return (request, reply) => {

        todoCreate = true;

        return reply(true);
    };
});

testServer.handler('todoBrowse', () => {

    return (request, reply) => {

        todoBrowse = true;

        return reply(true);
    };
});

testServer.handler('todoRemove', () => {

    return (request, reply) => {

        todoRemove = true;

        return reply(true);
    };
});

testServer.handler('todoUpdate', () => {

    return (request, reply) => {

        todoUpdate = true;

        return reply(true);
    };
});

testServer.route(TodoRoute);
testServer.route({
    path: '/',
    method: 'get',
    handler: (request, reply) => {

        return reply('').code(200);
    }
});

describe('server/route/todoRoute', () => {

    before((done) => {

        testServer.inject({
            method: 'get',
            url: '/'
        }, (res) => {

            crumb = res.headers['set-cookie'][0].split(';')[0].replace('crumb=', '');

            return done();
        });
    });

    beforeEach((done) => {

        todoCreate = false;
        todoBrowse = false;
        todoRemove = false;
        todoUpdate = false;

        return done();
    });

    it('has get path ' + restapi + '/list/{filter}', (done) => {

        testServer.inject({
            method: 'get',
            url: restapi + '/list/test'
        }, (res) => {

            expect(todoBrowse).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contains('must be one of');

            testServer.inject({
                method: 'get',
                url: restapi + '/list/all'
            }, (res) => {

                expect(todoBrowse).to.equal(true);
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(true);

                testServer.inject({
                    method: 'get',
                    url: restapi + '/list/active'
                }, (res) => {

                    expect(todoBrowse).to.equal(true);
                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal(true);

                    testServer.inject({
                        method: 'get',
                        url: restapi + '/list/completed'
                    }, (res) => {

                        expect(todoBrowse).to.equal(true);
                        expect(res.statusCode).to.equal(200);
                        expect(res.result).to.equal(true);

                        return done();
                    });
                });
            });
        });
    });

    it('has delete path ' + restapi + '/{id}', (done) => {

        testServer.inject({
            method: 'delete',
            url: restapi + '/someid',
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(todoRemove).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has post path ' + restapi, (done) => {

        testServer.inject({
            method: 'post',
            url: restapi,
            payload: { content: 'test' },
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(todoCreate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has post path validation ' + restapi, (done) => {

        testServer.inject({
            method: 'post',
            url: restapi,
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(todoCreate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });

    it('has put path ' + restapi, (done) => {

        testServer.inject({
            method: 'put',
            url: restapi,
            payload: { id: 'test' },
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(todoUpdate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has put path validation ' + restapi, (done) => {

        testServer.inject({
            method: 'put',
            url: restapi,
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(todoUpdate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });
});
