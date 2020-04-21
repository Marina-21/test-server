const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');


const { lines } = require('../const/lines');
const { spin } = require('../const/spin');

chai.use(chaiHttp);


describe.skip('Test wining lines', () => {

    it('spin', async() => {
        const res = await spin();

        expect(res.status.status).to.be.equal(200);

        if (res.context.hasOwnProperty('win')) {

            const winLines = res.context.win.lines;
            console.log(winLines);


            winLines.forEach((el) => {
                if (el.id !== null) {
                    const winPositions = el.positions;
                    console.log(winPositions);
                    const idLines = el.id;
                    const numberLines = lines[idLines];
                    const tempArr = numberLines.slice(0, winPositions.length);
                    const value = _.isEqual(winPositions, tempArr);
                    expect(tempArr.length).to.be.equal(winPositions.length);
                    expect(value).to.be.true;
                }
            });

            // done();

        } else {
            console.log('spin without win');
            // done();
        };

    });
});