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

let testTodosDB = [];
let testError = null;

let crumb;

testServer.method('todoModel.add', (todo, next) => {

    if (todo) {
        testTodosDB.push(todo);
    }

    return next(testError, testTodosDB);
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

        crumb = res.headers['set-cookie'][0].split(';')[0].replace('crumb=', '');

        return done();
    });
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
            method: 'post',
            url: '/',
            payload: { content: 'test' },
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
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
            headers: { cookie: 'crumb=' + crumb, 'x-csrf-token': crumb }
        }, (res) => {

            expect(res.statusCode).to.equal(201);
            expect(res.result.hasOwnProperty('success')).to.equal(true);
            expect(testTodosDB[0]).to.equal({ content: 'test' });

            return done();
        });
    });
});
