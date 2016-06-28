'use strict';

const TodoBrowse = require('../../server/handler/todoBrowse');
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

let testTodosDB = [];
let testError = null;

testServer.register(Crumb);

testServer.method('todoModel.row', (next) => {

    return next(testError, testTodosDB);
});

testServer.handler('todoBrowse', TodoBrowse);

testServer.route({
    path: '/web',
    method: 'get',
    handler: { todoBrowse: { web: true } }
});

testServer.route({
    path: '/rest',
    method: 'get',
    handler: { todoBrowse: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = [];
    testError = null;

    return done();
});

describe('server/handler/todoBrowse', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'get',
            url: '/rest'
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            testServer.inject({
                method: 'get',
                url: '/web'
            }, (res) => {

                expect(res.statusCode).to.equal(500);
                expect(res.result).to.contain('Error');
                expect(res.result).to.contain('<!doctype html>');

                return done();
            });
        });
    });

    it('returns 200 html page and json with todo list if web', (done) => {

        testTodosDB = [{ id: 'someId', done: false, content: 'sometask' }];

        testServer.inject({
            method: 'get',
            url: '/rest'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal({
                title: 'To Do List',
                list: [{ id: 'someId', done: false, content: 'sometask' }]
            });

            testServer.inject({
                method: 'get',
                url: '/web'
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.contain('sometask');
                expect(res.result).to.contain('<!doctype html>');

                return done();
            });
        });
    });
});
