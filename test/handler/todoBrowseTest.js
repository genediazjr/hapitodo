'use strict';

const TodoBrowse = require('../../server/handler/todoBrowse');
const TestServer = require('../testServer');

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
let testFilter = null;

testServer.method('todoModel.row', (filter, next) => {

    testFilter = filter;

    return next(testError, testTodosDB);
});

testServer.handler('todoBrowse', TodoBrowse);

testServer.route({
    path: '/{filter}',
    method: 'get',
    handler: { todoBrowse: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = [];
    testError = null;
    testFilter = null;

    return done();
});

describe('server/handler/todoBrowse', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'get',
            url: '/all'
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 200 json of todo list', (done) => {

        testTodosDB = [{ id: 'someId', done: false, content: 'sometask' }];

        testServer.inject({
            method: 'get',
            url: '/somefilter'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(testFilter).to.equal('somefilter');
            expect(res.result).to.equal([{ id: 'someId', done: false, content: 'sometask' }]);

            return done();
        });
    });

    it('returns 200 json of empty list even if db is null', (done) => {

        testTodosDB = null;

        testServer.inject({
            method: 'get',
            url: '/otherfilter'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(testFilter).to.equal('otherfilter');
            expect(res.result).to.equal({});

            return done();
        });
    });
});
