'use strict';

const TodoRoute = require('../../server/route/todoRoute');
const TestServer = require('../testServer');

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

const testServer = new TestServer();

const object = '/todo';
const restapi = '/api/v1' + object;

let todoCreateIsWeb = false;
let todoBrowseIsWeb = false;
let todoObtainIsWeb = false;
let todoCreate = false;
let todoBrowse = false;
let todoObtain = false;
let todoRemove = false;
let todoUpdate = false;

testServer.handler('todoCreate', (route, options) => {

    return (request, reply) => {

        todoCreate = true;
        todoCreateIsWeb = options.web;

        return reply(true);
    };
});

testServer.handler('todoBrowse', (route, options) => {

    return (request, reply) => {

        todoBrowse = true;
        todoBrowseIsWeb = options.web;

        return reply(true);
    };
});

testServer.handler('todoObtain', (route, options) => {

    return (request, reply) => {

        todoObtain = true;
        todoObtainIsWeb = options.web;

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

describe('server/route/todoRoute', () => {

    beforeEach((done) => {

        todoCreate = false;
        todoBrowse = false;
        todoObtain = false;
        todoRemove = false;
        todoUpdate = false;

        return done();
    });

    it('has get path ' + object, (done) => {

        testServer.inject({
            method: 'get',
            url: object
        }, (res) => {

            expect(todoCreate).to.equal(true);
            expect(todoCreateIsWeb).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has get path ' + object + '/list', (done) => {

        testServer.inject({
            method: 'get',
            url: object + '/list'
        }, (res) => {

            expect(todoBrowse).to.equal(true);
            expect(todoBrowseIsWeb).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has get path ' + object + '/{id}', (done) => {

        testServer.inject({
            method: 'get',
            url: object + '/someid'
        }, (res) => {

            expect(todoObtain).to.equal(true);
            expect(todoObtainIsWeb).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has get path validation ' + object + '/{id}', (done) => {

        testServer.inject({
            method: 'get',
            url: object + '/some'
        }, (res) => {

            expect(todoObtain).to.equal(false);
            expect(todoObtainIsWeb).to.equal(true);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be at least');

            return done();
        });
    });

    it('has get path ' + restapi + '/list', (done) => {

        testServer.inject({
            method: 'get',
            url: restapi + '/list'
        }, (res) => {

            expect(todoBrowse).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has get path ' + restapi + '/{id}', (done) => {

        testServer.inject({
            method: 'get',
            url: restapi + '/someid'
        }, (res) => {

            expect(todoObtain).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has get path validation ' + restapi + '/{id}', (done) => {

        testServer.inject({
            method: 'get',
            url: restapi + '/some'
        }, (res) => {

            expect(todoObtain).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be at least');

            return done();
        });
    });

    it('has delete path ' + restapi + '/{id}', (done) => {

        testServer.inject({
            method: 'delete',
            url: restapi + '/someid'
        }, (res) => {

            expect(todoRemove).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has delete path validation ' + restapi + '/{id}', (done) => {

        testServer.inject({
            method: 'delete',
            url: restapi + '/some'
        }, (res) => {

            expect(todoRemove).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be at least');

            return done();
        });
    });

    it('has post path ' + restapi, (done) => {

        testServer.inject({
            method: 'post',
            url: restapi,
            payload: { content: 'test' }
        }, (res) => {

            expect(todoCreate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has post path ' + restapi + '/{someid}', (done) => {

        testServer.inject({
            method: 'post',
            url: restapi + '/someid',
            payload: { content: 'test' }
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
            url: restapi
        }, (res) => {

            expect(todoCreate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });

    it('has post path validation ' + restapi + '/{someid}', (done) => {

        testServer.inject({
            method: 'post',
            url: restapi + '/someid'
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
            payload: { id: 'test' }
        }, (res) => {

            expect(todoUpdate).to.equal(true);
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal(true);

            return done();
        });
    });

    it('has put path ' + restapi + '/{someid}', (done) => {

        testServer.inject({
            method: 'put',
            url: restapi + '/someid',
            payload: { id: 'test' }
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
            url: restapi
        }, (res) => {

            expect(todoUpdate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });

    it('has put path validation ' + restapi + '/{someid}', (done) => {

        testServer.inject({
            method: 'put',
            url: restapi + '/someid'
        }, (res) => {

            expect(todoUpdate).to.equal(false);
            expect(res.statusCode).to.equal(400);
            expect(res.result.message).to.contain('must be an object');

            return done();
        });
    });
});
