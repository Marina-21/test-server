const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


const { betLines } = require('../const/function');
const { spin } = require('../const/spinPlatform');
const { Dev } = require('../const/platforms');
const { favorit } = require('../const/platforms');
const { checkWin1 } = require('../const/function');

chai.use(chaiHttp);

let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[10];
let elbet = bets[2];

chai.use(chaiHttp);

for (let i = 0; i < 100; i++) {
    describe.skip('Test type of win', () => {
        let data = {
            funcResultWin: false,
            gameTypeWin: null,
            res: null,
        };

        before("Spin", async() => {
            try {
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { res, actionSpin } = responce;
                console.log(res);
                console.log(actionSpin);

                const funcResultWin = checkWin1(res);


                data = { res, funcResultWin };

                if (funcResultWin !== null) {
                    const gameTypeWin = res.context.win.type;
                    console.log((gameTypeWin) + '  - gameTypeWin');

                    data = {...data, gameTypeWin };
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it("check type of win", () => {
            let { funcResultWin, res, gameTypeWin } = data;

            if (funcResultWin !== null) {
                const bet = betLines(res);
                let totalWin = res.context.win.total;

                const typeCoef = totalWin / bet;

                let rightTypeWin;
                console.log((typeCoef) + " - typeCoef");
                if (typeCoef < 12.5) {
                    rightTypeWin = "regular";
                } else if (typeCoef >= 12.5 && typeCoef < 100) {
                    rightTypeWin = "big";
                } else if (typeCoef >= 100 && typeCoef < 500) {
                    rightTypeWin = "ultra";
                } else if (typeCoef >= 500 && typeCoef <= 1500) {
                    rightTypeWin = "mega";
                }
                expect(gameTypeWin).to.be.eq(rightTypeWin);
            }
        });
    });
}