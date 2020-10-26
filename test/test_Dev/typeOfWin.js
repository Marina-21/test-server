const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');
require('dotenv').config();


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';
logger.error();


const { checkWin1, checkTypeWin, readToken } = require('../../const/function');
const { spin } = require('../../const/spinPlatform');
const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');


chai.use(chaiHttp);

const platform = {
    Favorit: Favorit,
    Gizil: Gizil,
    Dev: Dev,
    OMG: OMG,
    Favoritsport: Favoritsport,
    FavBet: FavBet
};

let { urlSpin, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
const [nameGame] = [process.env.GAME];
console.log(nameGame);

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });
console.log(indexGame);

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];
let elbet = gamesDate[game.number][bet][2];


for (let i = 0; i < 500; i++) {
    describe.only(`Test type of win  ${name}: ${i}`, () => {
        let data = {
            funcResultWin: false,
            gameTypeWin: null,
            res: null,
        };

        before("Spin", async() => {
            try {
                let token = await readToken(nameToken);
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { res, actionSpin } = responce;
                console.log(urlSpin);
                console.log(res);
                logger.info(`check type of win 10 Lines - ${i}`);
                logger.info(res);
                console.log(actionSpin);
                logger.info(actionSpin);
                logger.info(res.context.matrix);

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
        it("check type of win", () => {
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