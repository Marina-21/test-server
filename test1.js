const mocha = require('mocha');
const chai = require('chai');

const expect = chai.expect;

describe('My first block withs different tests', () => {
    it('Check method "indexOf"', () => {
        const betArray = [0.1, 0.2, 0.3, 0.5, 1, 5, 10, 100];

        const position = betArray.indexOf(0.5); // must be 3

        expect(0.5).to.be.equal(betArray[position]);
    });
});