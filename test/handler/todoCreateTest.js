'use strict';

const TodoCreate = require('../../server/handler/todoCreate');
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
    testTodosDB: [],
    testError: null,
    crumb: null
};

testServer.method('todoModel.add', (todo, next) => {

    if (todo) {
        internals.testTodosDB.push(todo);
    }

    return next(internals.testError, internals.testTodosDB);
});

testServer.handler('todoCreate', TodoCreate);

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
        method: 'post',
        handler: { todoCreate: {} },
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

    internals.testTodosDB = [];
    internals.testError = null;

    return done();
});

describe('server/handler/todoCreate', () => {

    it('returns 500 if model has error', (done) => {

        internals.testError = new Error('some error');

        testServer.inject({
            method: 'post',
            url: '/',
            payload: { content: 'test' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(res.statusCode).to.equal(500);
            expect(res.result.statusCode).to.equal(500);
            expect(res.result.message).to.exist();

            return done();
        });
    });

    it('returns 200 success if payload is valid', (done) => {


        testServer.inject({
            method: 'post',
            url: '/',
            payload: { content: 'test' },
            headers: { cookie: `crumb=${internals.crumb}`, 'x-csrf-token': internals.crumb }
        }, (res) => {

            expect(res.statusCode).to.equal(201);
            expect(res.result.hasOwnProperty('success')).to.equal(true);
            expect(internals.testTodosDB[0]).to.equal({ content: 'test' });

            return done();
        });
    });
});
