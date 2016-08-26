'use strict';

const TodoUpdate = require('../../server/handler/todoUpdate');
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
    testTodosDB: {},
    testError: null,
    crumb: null
};

testServer.method('todoModel.set', (todo, next) => {

    let isUpdated = false;
    if (internals.testTodosDB[todo.id]) {
        isUpdated = true;
        if (todo.hasOwnProperty('done')) {
            internals.testTodosDB[todo.id].done = todo.done;
        }
        if (todo.hasOwnProperty('content')) {
            internals.testTodosDB[todo.id].content = todo.content;
        }
    }

    return next(internals.testError, isUpdated);
});

testServer.handler('todoUpdate', TodoUpdate);

testServer.route([
    {
        path: '/',
        method: 'get',
        handler: (request, reply) => {

            return reply('').code(200);
        }
    },
    {
        path: '/',
        method: 'put',
        handler: { todoUpdate: {} },
        config: { plugins: { errorh: false } }
    }
]);

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

    internals.testTodosDB = {};
    internals.testError = null;

    return done();
});

describe('server/handler/todoUpdate', () => {

    it('returns 500 if model has error', (done) => {

        internals.testError = new Error('some error');

        testServer.inject({
            method: 'put',
            url: '/',
            payload: { id: 'someId' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
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
            payload: { id: 'someid', content: 'value' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(res.statusCode).to.equal(404);
            expect(res.result.statusCode).to.equal(404);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 200 json success if todo is updated', (done) => {

        internals.testTodosDB.someid = { id: 'someid', done: true, content: 'sometask' };

        testServer.inject({
            method: 'put',
            url: '/',
            payload: { id: 'someid', content: 'value' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            expect(res.result.hasOwnProperty('success')).to.equal(true);
            expect(internals.testTodosDB.someid).to.equal({ id: 'someid', done: true, content: 'value' });

            testServer.inject({
                method: 'put',
                url: '/',
                payload: { id: 'someid', done: false },
                headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
            }, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.hasOwnProperty('success')).to.equal(true);
                expect(internals.testTodosDB.someid).to.equal({ id: 'someid', done: false, content: 'value' });

                testServer.inject({
                    method: 'put',
                    url: '/',
                    payload: { id: 'someid', done: true, content: 'othertask' },
                    headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
                }, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.hasOwnProperty('success')).to.equal(true);
                    expect(internals.testTodosDB.someid).to.equal({ id: 'someid', done: true, content: 'othertask' });

                    return done();
                });
            });
        });
    });
});
