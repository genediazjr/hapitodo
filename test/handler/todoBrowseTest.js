'use strict';

const TodoBrowse = require('../../server/handler/todoBrowse');
const testServer = require('../testServer')();

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

const internals = {
    testTodosDB: [],
    testError: null,
    testFilter: null
};

testServer.method('todoModel.row', (filter, next) => {

    internals.testFilter = filter;

    return next(internals.testError, internals.testTodosDB);
});

testServer.handler('todoBrowse', TodoBrowse);

testServer.route({
    path: '/{filter}',
    method: 'get',
    handler: { todoBrowse: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    internals.testTodosDB = [];
    internals.testError = null;
    internals.testFilter = null;

    return done();
});

describe('server/handler/todoBrowse', () => {

    it('returns 500 if model has error', (done) => {

        internals.testError = new Error('some error');

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

        internals.testTodosDB = [{ id: 'someId', done: false, content: 'sometask' }];

        testServer.inject({
            method: 'get',
            url: '/somefilter'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(internals.testFilter).to.equal('somefilter');
            expect(res.result).to.equal([{ id: 'someId', done: false, content: 'sometask' }]);

            return done();
        });
    });

    it('returns 200 json of empty list even if db is null', (done) => {

        internals.testTodosDB = null;

        testServer.inject({
            method: 'get',
            url: '/otherfilter'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(internals.testFilter).to.equal('otherfilter');
            expect(res.result).to.equal({});

            return done();
        });
    });
});
