const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');
const fetch = require('node-fetch');

const { spin } = require('../const/spin');




chai.use(chaiHttp);

describe('Test wining null', () => {
    it('spin', () => {
        console.log(spin());
    });

});