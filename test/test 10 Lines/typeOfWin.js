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
logger.error();


const { betLines } = require('../../const/function');
const { spin } = require('../../const/spinPlatform');
const { Dev } = require('../../const/platforms');
const { favorit } = require('../../const/platforms');
const { checkWin1 } = require('../../const/function');
const { checkTypeWin } = require('../../const/function');

chai.use(chaiHttp);

let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[10];
let elbet = bets[2];

chai.use(chaiHttp);

for (let i = 0; i < 100; i++) {
    describe.skip(`Test type of win 10Lines${i}`, () => {
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
                logger.info(`check type of win 10 Lines - ${i}`);
                logger.info(res);
                console.log(actionSpin);
                logger.info(actionSpin);

                const funcResultWin = checkWin1(res);
                data = { res, funcResultWin };

                if (funcResultWin !== null) {
                    const gameTypeWin = res.context.win.type;
                    console.log((gameTypeWin) + '  - gameTypeWin');

                    data = {...data, gameTypeWin };

                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it("check type of win 10 Lines", () => {
            let { funcResultWin, res, gameTypeWin } = data;

            if (funcResultWin !== null) {
                let rightTypeWin = checkTypeWin(res);

                logger.info(`${rightTypeWin} - rightTypeWin`);

                expect(gameTypeWin).to.eql(rightTypeWin);
                logger.info("Type of win is correct");
            }
        });
    });
}