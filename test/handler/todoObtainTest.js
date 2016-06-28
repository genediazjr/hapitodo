'use strict';

const TodoObtain = require('../../server/handler/todoObtain');
const TestServer = require('../testServer');

const Crumb = require('crumb');
const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

const testServer = new TestServer();

let testTodosDB = {};
let testError = null;

testServer.register(Crumb);

testServer.method('todoModel.get', (id, next) => {

    return next(testError, testTodosDB[id]);
});

testServer.handler('todoObtain', TodoObtain);

testServer.route({
    path: '/web/{id}',
    method: 'get',
    handler: { todoObtain: { web: true } }
});

testServer.route({
    path: '/rest/{id}',
    method: 'get',
    handler: { todoObtain: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = {};
    testError = null;

    return done();
});

describe('server/handler/todoObtain', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'get',
            url: '/rest/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            testServer.inject({
                method: 'get',
                url: '/web/someid'
            }, (res) => {

                expect(res.statusCode).to.equal(500);
                expect(res.result).to.contain('Error');
                expect(res.result).to.contain('<!doctype html>');

                return done();

            });
        });
    });

    it('returns 404 if id does not exist', (done) => {

        testServer.inject({
            method: 'get',
            url: '/rest/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(404);
            expect(res.result.statusCode).to.equal(404);
            expect(res.result.message).to.exist();

            testServer.inject({
                method: 'get',
                url: '/web/someid'
            }, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result).to.contain('Not Found');
                expect(res.result).to.contain('<!doctype html>');

                return done();

            });
        });
    });

    it('returns 200 html and json of the object if id exists', (done) => {

        testTodosDB.someid = { id: 'someid', done: true, content: 'sometask' };

        testServer.inject({
            method: 'get',
            url: '/rest/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal({
                title: 'To Do Item',
                item: { id: 'someid', done: true, content: 'sometask' }
            });

            testServer.inject({
                method: 'get',
                url: '/web/someid'
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.contain('sometask');
                expect(res.result).to.contain('<!doctype html>');

                return done();

            });
        });
    });
});
