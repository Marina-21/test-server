const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');


const { lines } = require('../const/lines');
const { spin } = require('../const/spin');

chai.use(chaiHttp);


describe.skip('Test type of win', () => {

    it('spintype of win is tru', async() => {
        const res = await spin();
        expect(res.status.status).to.be.equal(200);


        function typeofwin() {
            const totalWin = res.context.win.total;
            const bet = res.context.bet;
            const typeCoef = totalWin / bet;
            console.log((typeCoef) + " - typeCoef");
            if (typeCoef < 12.5) {
                return "regular";
            } else if (typeCoef >= 12.5 && typeCoef < 100) {
                return "big";
            } else if (typeCoef >= 100 && typeCoef < 500) {
                return "ultra";
            } else(typeCoef >= 500 && typeCoef <= 1500); {
                return "mega";
            }
        };

        if (res.context.hasOwnProperty('win')) {

            const gameTypeWin = res.context.win.type;
            console.log((gameTypeWin) + '  - gameTypeWin');


            expect(gameTypeWin).to.eql(typeofwin());
            console.log("Type of win is correct");

        } else {

            console.log("spin without wining");

        };
    });
});