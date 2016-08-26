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

const internals = {
    restapi: '/api/v1/todo',
    todoCreate: false,
    todoBrowse: false,
    todoRemove: false,
    todoUpdate: false,
    crumb: null
};

testServer.handler('todoCreate', () => {

    return (request, reply) => {

        internals.todoCreate = true;

        return reply(true);
    };
});

testServer.handler('todoBrowse', () => {

    return (request, reply) => {

        internals.todoBrowse = true;

        return reply(true);
    };
});

testServer.handler('todoRemove', () => {

    return (request, reply) => {

        internals.todoRemove = true;

        return reply(true);
    };
});

testServer.handler('todoUpdate', () => {

    return (request, reply) => {

        internals.todoUpdate = true;

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

            internals.crumb = res.headers['set-cookie'][0].split(';')[0].replace('crumb=', '');

            return done();
        });
    });

    beforeEach((done) => {

        internals.todoCreate = false;
        internals.todoBrowse = false;
        internals.todoRemove = false;
        internals.todoUpdate = false;

        return done();
    });

    it(`has get path ${internals.restapi}/list/{filter}`, (done) => {

        testServer.inject({
            method: 'get',
            url: `${internals.restapi}/list/test`
        }, (res) => {

            expect(internals.todoBrowse).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contains('must be one of');

            testServer.inject({
                method: 'get',
                url: `${internals.restapi}/list/all`
            }, (res) => {

                expect(internals.todoBrowse).to.equal(true);
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(true);

                testServer.inject({
                    method: 'get',
                    url: `${internals.restapi}/list/active`
                }, (res) => {

                    expect(internals.todoBrowse).to.equal(true);
                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal(true);

                    testServer.inject({
                        method: 'get',
                        url: `${internals.restapi}/list/completed`
                    }, (res) => {

                        expect(internals.todoBrowse).to.equal(true);
                        expect(res.statusCode).to.equal(200);
                        expect(res.result).to.equal(true);

                        return done();
                    });
                });
            });
        });
    });

    it(`has delete path ${internals.restapi}/{id}`, (done) => {

        testServer.inject({
            method: 'delete',
            url: `${internals.restapi}/someid`,
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(internals.todoRemove).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it(`has post path ${internals.restapi}`, (done) => {

        testServer.inject({
            method: 'post',
            url: internals.restapi,
            payload: { content: 'test' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(internals.todoCreate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it(`has post path validation ${internals.restapi}`, (done) => {

        testServer.inject({
            method: 'post',
            url: internals.restapi,
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(internals.todoCreate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });

    it(`has put path ${internals.restapi}`, (done) => {

        testServer.inject({
            method: 'put',
            url: internals.restapi,
            payload: { id: 'test' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(internals.todoUpdate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it(`has put path validation ${internals.restapi}`, (done) => {

        testServer.inject({
            method: 'put',
            url: internals.restapi,
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(internals.todoUpdate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });
});
