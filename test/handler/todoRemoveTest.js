'use strict';

const TodoRemove = require('../../server/handler/todoRemove');
const testServer = require('../testServer')();

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

let testTodosDB = {};
let testError = null;

testServer.method('todoModel.del', (id, next) => {

    let isDeleted = false;
    if (testTodosDB[id]) {
        isDeleted = true;
        delete testTodosDB[id];
    }

    return next(testError, isDeleted);
});

testServer.handler('todoRemove', TodoRemove);

testServer.route({
    path: '/{id}',
    method: 'delete',
    handler: { todoRemove: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = {};
    testError = null;

    return done();
});

describe('server/handler/todoRemove', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'delete',
            url: '/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 404 if id does not exist', (done) => {

        testServer.inject({
            method: 'delete',
            url: '/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(404);
            expect(res.result.statusCode).to.equal(404);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 200 json success if todo is deleted', (done) => {

        testTodosDB.someid = { id: 'someid', done: true, content: 'sometask' };

        testServer.inject({
            method: 'delete',
            url: '/someid'
        }, (res) => {

            expect(res.statusCode).to.equal(204);
            expect(res.result).to.not.exist();
            expect(testTodosDB).to.equal({});

            return done();
        });
    });
});
