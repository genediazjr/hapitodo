'use strict';

const TodoCreate = require('../../server/handler/todoCreate');
const testServer = require('../testServer')();

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

let testTodosDB = [];
let testError = null;

testServer.method('todoModel.add', (todo, next) => {

    if (todo) {
        testTodosDB.push(todo);
    }

    return next(testError, testTodosDB);
});

testServer.handler('todoCreate', TodoCreate);

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
            method: 'post',
            url: '/',
            payload: { content: 'test' }
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
            payload: { content: 'test' }
        }, (res) => {

            expect(res.statusCode).to.equal(201);
            expect(res.result.hasOwnProperty('success')).to.equal(true);
            expect(testTodosDB[0]).to.equal({ content: 'test' });

            return done();
        });
    });
});
