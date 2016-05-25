/* jshint -W079 */
'use strict';

const Code = require('code');
const Lab = require('lab');
const Config = require('../server/config');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('server/config', () => {

    it('gets manifest data', (done) => {

        expect(Config.get('/')).to.be.an.object();

        return done();
    });

    it('gets manifest meta data', (done) => {

        expect(Config.meta('/')).to.match(/this file configures the plot device/i);

        return done();
    });
});
