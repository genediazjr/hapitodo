/* jshint -W079 */
'use strict';

const Code = require('code');
const Lab = require('lab');
const Composer = require('../server/composer');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('server/composer', () => {

    it('composes a server', (done) => {

        Composer((err, server) => {

            expect(server).to.be.an.object();

            return done(err);
        });
    });
});
