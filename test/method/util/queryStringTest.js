/* jshint -W079 */
'use strict';

const Iron = require('iron');
const Code = require('code');
const Lab = require('lab');
const QueryString = require('../../../server/method/util/queryString');
const Config = require('../../../server/config');
const qsKey = Config.get('/qsKey');
const secret = Config.get('/iron/secret');
const options = Config.get('/iron/options');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

describe('server/method/util/queryString', () => {

    it('returns empty if no params for build', (done) => {

        QueryString.build(null, (err, data) => {

            expect(err).to.not.exist();
            expect(data).to.not.exist();

            return done();
        });
    });

    it('returns empty if no params for parse', (done) => {

        QueryString.parse(null, (err, data) => {

            expect(err).to.not.exist();
            expect(data).to.not.exist();

            return done();
        });
    });

    it('builds the params with build function', (done) => {

        const testObj = { a: 'b' };

        QueryString.build(testObj, (err, queryString) => {

            expect(err).to.not.exist();

            Iron.unseal(queryString.replace('/?' + qsKey + '=', ''), secret, options, (err, unsealed) => {

                expect(err).to.not.exist();
                expect(unsealed).to.equal(testObj);

                return done();
            });
        });
    });

    it('parses the params with parse function', (done) => {

        const testObj = { a: 'b' };

        Iron.seal(testObj, secret, options, (err, sealed) => {

            expect(err).to.not.exist();

            const queryObj = {};
            queryObj[qsKey] = sealed;

            QueryString.parse(queryObj, (err, queryParams) => {

                expect(err).to.not.exist();
                expect(queryParams).to.equal(testObj);

                return done();
            });
        });
    });
});
