'use strict';

const TodoCreate = require('../../server/handler/todoCreate');
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

testServer.method('todoModel.add', (todo, next) => {

    testTodosDB.push(todo);

    return next(testError, testTodosDB);
});

testServer.handler('todoCreate', TodoCreate);

testServer.route({
    path: '/',
    method: 'get',
    handler: { todoCreate: { web: true } }
});

testServer.route({
    path: '/',
    method: 'post',
    handler: { todoCreate: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = [];
    testError = null;

    return done();
});

describe('server/handler/todoCreate', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'get',
            url: '/'
        }, (res) => {

            const crumb = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

            testServer.inject({
                method: 'post',
                url: '/',
                headers: { cookie: 'crumb=' + crumb },
                payload: { content: 'test', crumb: crumb }
            }, (res) => {

                expect(res.statusCode).to.equal(500);
                expect(res.result.statusCode).to.equal(500);
                expect(res.result.message).to.exist();

                return done();
            });
        });
    });

    it('returns 400 if payload is invalid', (done) => {

        testServer.inject({
            method: 'get',
            url: '/'
        }, (res) => {

            const crumb = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

            testServer.inject({
                method: 'post',
                url: '/',
                headers: { cookie: 'crumb=' + crumb },
                payload: { test: 'value', crumb: crumb }
            }, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.statusCode).to.equal(400);
                expect(res.result.message).to.exist();

                testServer.inject({
                    method: 'post',
                    url: '/',
                    headers: { cookie: 'crumb=' + crumb },
                    payload: { crumb: crumb }
                }, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.statusCode).to.equal(400);
                    expect(res.result.message).to.exist();

                    return done();
                });
            });
        });
    });

    it('returns 200 success if payload is valid', (done) => {

        testServer.inject({
            method: 'get',
            url: '/'
        }, (res) => {

            const crumb = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

            testServer.inject({
                method: 'post',
                url: '/',
                headers: { cookie: 'crumb=' + crumb },
                payload: { content: 'test', crumb: crumb }
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.hasOwnProperty('success')).to.equal(true);
                expect(testTodosDB[0]).to.equal({ content: 'test' });

                return done();
            });
        });
    });

    it('returns 200 html page if options.web is true', (done) => {

        testServer.route({
            path: '/test',
            method: 'post',
            handler: { todoCreate: { web: true } }
        });

        testServer.inject({
            method: 'get',
            url: '/'
        }, (res) => {

            const crumb = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

            testServer.inject({
                method: 'post',
                url: '/test',
                headers: { cookie: 'crumb=' + crumb },
                payload: { crumb: crumb }
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.contain('New');
                expect(res.result).to.contain('<!doctype html>');

                testServer.inject({
                    method: 'get',
                    url: '/'
                }, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.contain('New');
                    expect(res.result).to.contain('<!doctype html>');
                    expect(res.headers['set-cookie'][0].split(';')[0].split('=')[0]).to.equal('crumb');

                    return done();
                });
            });
        });
    });
});
