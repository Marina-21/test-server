const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;
require('dotenv').config();
const _ = require('lodash');

const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { init } = require('../../const/spinPlatform');
const { checkWin1, readToken } = require('../../const/function');

chai.use(chaiHttp);

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


const platform = {
    Favorit: Favorit,
    Gizil: Gizil,
    Dev: Dev,
    OMG: OMG,
    Favoritsport: Favoritsport,
    FavBet: FavBet
};

let { urlSpin, urlInit, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
const [nameGame] = [process.env.GAME];

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];

let elbet = gamesDate[game.number][bet];

let arrGamesDate = [gamesDate[17]];

arrGamesDate.forEach((el) => {


    describe.only(`Test win ${name}`, () => {

        let token;
        let res;

        before("Init", async() => {
            try {
                token = await readToken(nameToken);
                let response = await init(urlInit, token, id);
                res = response.res;
                console.log(res);
                let actionSpin = response.actionSpin;
                console.log(urlInit);
                console.log(res.context.current + "   type of Init");
                logger.info(res);

                let file = { balance: res.user.balance, actionSpin };
                await fs.writeFile('db.json', JSON.stringify(file));


            } catch (error) {
                let { code, message } = error;
                console.log(code + "  code");
                console.log(message + "  message");
                logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it("check bet", () => {
            let betsInit = res.settings.bets;
            const value = _.isEqual(betsInit, elbet);
            console.log(betsInit);
            console.log(elbet);
            expect(value).to.be.true;
        });
        elbet.forEach((elbet) => {
            it('check withdraw a different bets from the balance, check all bets in platform', async() => {
                const file = await fs.readFile('db.json', 'utf8');
                const obj = JSON.parse(file);
                let { actionSpin } = obj;

                console.log(` actionSpin ${actionSpin}`);
                console.log(` elbet ${elbet}`);
                ijnjkn
                if (actionSpin === "freespin") {
                    let action = "freespin";
                    while (action === "freespin") {
                        try {
                            token = await readToken(nameToken);
                            let responce = await spin(urlSpin, token, id, elbet, lines);
                            let { actionSpin, res } = responce;
                            console.log(urlSpin);
                            action = actionSpin;
                            console.log(res);
                            console.log(`actionSpin ${actionSpin}`);
                            console.log(`action ${action}`);
                            let file = { balance: res.user.balance, actionSpin };
                            await fs.writeFile('db.json', JSON.stringify(file));
                        } catch (error) {
                            logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                            logger.info('!!!!!!ERROR in before block!!!!!! ' + error);

                        }
                    }

                } else {
                    try {
                        token = await readToken(nameToken);
                        let responce = await spin(urlSpin, token, id, elbet, lines);
                        let { actionSpin, res } = responce;
                        console.log(urlSpin);
                        console.log(res.context.current + "   type of Spin ");
                        logger.info(res);
                        logger.info(`bet ${elbet}`);
                        logger.info(`idGames ${id}`);


                        let { user, context } = res;
                        let newBalance = user.balance;
                        let totalBet = context.bet * lines;

                        const file = await fs.readFile('db.json', 'utf8');
                        const obj = JSON.parse(file);
                        let { balance } = obj;

                        const funcResult = checkWin1(res);
                        if (funcResult !== null) {
                            let rightBalance = balance - totalBet + res.context.win.total;
                            expect(rightBalance).to.equal(Number(newBalance));

                            let file = { balance: newBalance, actionSpin };
                            await fs.writeFile('db.json', JSON.stringify(file));
                            logger.info(`rightBalans ${rightBalance}`);
                            logger.info(`newBalance ${newBalance}`);
                            console.log(`rightBalans ${rightBalance}`);
                            console.log(`newBalance ${newBalance}`);

                        } else {
                            let rightBalance = balance - totalBet;
                            expect(rightBalance).to.equal(newBalance);

                            let file = { balance: newBalance, actionSpin };
                            await fs.writeFile('db.json', JSON.stringify(file));
                            logger.info(`rightBalans ${rightBalance}`);
                            logger.info(`newBalance ${newBalance}`);
                            console.log(`rightBalans ${rightBalance}`);
                            console.log(`newBalance ${newBalance}`);
                        }

                    } catch (error) {
                        logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                        logger.info('!!!!!!ERROR in before block!!!!!! ' + error);

                    }
                }
            });

        });
    });
});