'use strict';

const TodoUpdate = require('../../server/handler/todoUpdate');
const TestServer = require('../testServer');

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

testServer.method('todoModel.set', (todo, next) => {

    let isUpdated = false;
    if (testTodosDB[todo.id]) {
        isUpdated = true;
        if (todo.hasOwnProperty('done')) {
            testTodosDB[todo.id].done = todo.done;
        }
        if (todo.hasOwnProperty('content')) {
            testTodosDB[todo.id].content = todo.content;
        }
    }

    return next(testError, isUpdated);
});

testServer.handler('todoUpdate', TodoUpdate);

testServer.route({
    path: '/',
    method: 'put',
    handler: { todoUpdate: {} },
    config: { plugins: { errorh: false } }
});

beforeEach((done) => {

    testTodosDB = {};
    testError = null;

    return done();
});

describe('server/handler/todoUpdate', () => {

    it('returns 500 if model has error', (done) => {

        testError = new Error('some error');

        testServer.inject({
            method: 'put',
            url: '/',
            payload: { id: 'someId' }
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 404 if todo id does not exist', (done) => {

        testServer.inject({
            method: 'put',
            url: '/',
            payload: { id: 'someid', content: 'value' }
        }, (res) => {

            expect(res.statusCode).to.equal(404);
            expect(res.result.statusCode).to.equal(404);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 200 json success if todo is updated', (done) => {

        testTodosDB.someid = { id: 'someid', done: true, content: 'sometask' };

        testServer.inject({
            method: 'put',
            url: '/',
            payload: { id: 'someid', content: 'value' }
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(res.result.hasOwnProperty('success')).to.equal(true);
            expect(testTodosDB.someid).to.equal({ id: 'someid', done: true, content: 'value' });

            testServer.inject({
                method: 'put',
                url: '/',
                payload: { id: 'someid', done: false }
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.hasOwnProperty('success')).to.equal(true);
                expect(testTodosDB.someid).to.equal({ id: 'someid', done: false, content: 'value' });

                testServer.inject({
                    method: 'put',
                    url: '/',
                    payload: { id: 'someid', done: true, content: 'othertask' }
                }, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.hasOwnProperty('success')).to.equal(true);
                    expect(testTodosDB.someid).to.equal({ id: 'someid', done: true, content: 'othertask' });

                    return done();
                });
            });
        });
    });
});
