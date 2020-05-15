const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');
const { betLines } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';



const { spin } = require('../../const/spin');

chai.use(chaiHttp);

for (let i = 0; i < 100; i++) {
    describe.skip('Test type of win', () => {

        it('spintype of win is tru', async() => {
            const res = await spin();
            expect(res.status.status).to.be.equal(200);


            function typeofwin() {
                const totalWin = res.context.win.total;
                const bet = betLines(res);
                const typeCoef = totalWin / bet;
                console.log((typeCoef) + " - typeCoef");
                if (typeCoef < 12.5) {
                    return "regular";
                } else if (typeCoef >= 12.5 && typeCoef < 100) {
                    return "big";
                } else if (typeCoef >= 100 && typeCoef < 500) {
                    return "ultra";
                } else if (typeCoef >= 500 && typeCoef <= 1500) {
                    return "mega";
                }
            }

            if (res.context.hasOwnProperty('win')) {

                const gameTypeWin = res.context.win.type;
                console.log((gameTypeWin) + '  - gameTypeWin');


                expect(gameTypeWin).to.eql(typeofwin());
                // console.log("Type of win is correct");
                logger.info("Type of win is correct");

            } else {

                console.log("spin without wining");

            }
        });
    });
}