// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');


const { lines10 } = require('../const/lines10');
const { spin } = require('../const/spin');

chai.use(chaiHttp);

for (let i = 0; i < 500; i++) {
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
                        const numberLines = lines10[idLines];
                        const tempArr = numberLines.slice(0, winPositions.length);
                        const value = _.isEqual(winPositions, tempArr);
                        expect(tempArr.length).to.be.equal(winPositions.length);
                        expect(value).to.be.true;
                    }
                });

            } else {
                console.log('spin without win');
                // done();
            }

        });
    });
}