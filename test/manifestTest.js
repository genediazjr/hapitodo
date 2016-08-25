'use strict';

const Manifest = require('../server/manifest');

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('server/manifest', () => {

    it('gets manifest data', (done) => {

        expect(Manifest.get('/', {})).to.be.an.object();
        expect(Manifest.get('/', { db: 'postgres' })).to.be.an.object();

        return done();
    });
});
