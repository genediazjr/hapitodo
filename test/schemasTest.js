'use strict';

const Schemas = require('../server/schemas');

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('server/schemas.todoSchema', () => {

    it('validates object', (done) => {

        expect(Schemas.todoSchema.validate({ test: 'val' }).error).to.exist();

        return done();
    });

    it('allows id as string, done as boolean, and content as string', (done) => {

        expect(Schemas.todoSchema.validate({ id: 1 }).error).to.exist();
        expect(Schemas.todoSchema.validate({ id: 'id' }).error).to.not.exist();
        expect(Schemas.todoSchema.validate({ done: false}).error).to.not.exist();
        expect(Schemas.todoSchema.validate({ done: 'somtest'}).error).to.exist();
        expect(Schemas.todoSchema.validate({ done: 'false'}).error).to.not.exist();
        expect(Schemas.todoSchema.validate({ content: 1234567 }).error).to.exist();
        expect(Schemas.todoSchema.validate({ content: 'test' }).error).to.not.exist();

        return done();
    });

    it('exposes a todoObject', (done) => {

        expect(Schemas.todoObject).to.be.an.object();

        return done();
    });
});
