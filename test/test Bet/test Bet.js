const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;

const { FavoritSpin } = require('../../const/platforms');
const { FavoritInit } = require('../../const/platforms');
const { GizilSpin } = require('../../const/platforms');
const { GizilInit } = require('../../const/platforms');
const { DevSpin } = require('../../const/platforms');
const { DevInit } = require('../../const/platforms');
const { devBets } = require('../../const/platforms');
const { GizilBets } = require('../../const/platforms');
const { favoritBets } = require('../../const/platforms');
const { gamesDate } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { init } = require('../../const/spinPlatform');
const { checkWin1 } = require('../../const/function');

chai.use(chaiHttp);

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

let { urlSpin, token } = GizilSpin;
let { urlInit, } = GizilInit;

gamesDate.forEach((el) => {

    describe.only('Test win', () => {

        // let id = el.id;
        // let lines = el.lines;
        let { id, lines } = el;



        before("Init", async() => {
            try {
                let res = await init(urlInit, token, id);
                console.log(res.context.current + "   type of Init");
                logger.info(res);

                let file = { balance: res.user.balance };
                await fs.writeFile('db1.json', JSON.stringify(file));


            } catch (error) {
                let { code, message } = res.status;
                console.log(code + "  code");
                console.log(message + "  message");
                logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });

        GizilBets.forEach((elbet) => {
            it('check withdraw a different bets from the balance, check all bets in platform', async() => {
                try {
                    let res = await spin(urlSpin, token, id, elbet, lines);
                    console.log(res.context.current + "   type of Spin ");
                    logger.info(res);
                    logger.info(`bet ${elbet}`);
                    logger.info(`idGames ${id}`);

                    let { user, context } = res;
                    let newBalance = user.balance;

                    let totalBet = context.bet * lines;

                    const file = await fs.readFile('db1.json', 'utf8');
                    const obj = JSON.parse(file);
                    let { balance } = obj;

                    const funcResult = checkWin1(res);
                    if (funcResult !== null) {
                        let rightBalance = balance - totalBet + res.context.win.total;
                        expect(rightBalance).to.equal(Number(newBalance));

                        let file = { balance: newBalance };
                        await fs.writeFile('db1.json', JSON.stringify(file));
                        logger.info(`rightBalans ${rightBalance}`);
                        logger.info(`newBalance ${newBalance}`);

                    } else {
                        let rightBalance = balance - totalBet;

                        expect(rightBalance).to.equal(newBalance);

                        let file = { balance: newBalance };
                        await fs.writeFile('db1.json', JSON.stringify(file));
                        logger.info(`rightBalans ${rightBalance}`);
                        logger.info(`newBalance ${newBalance}`);

                    }
                } catch (error) {
                    logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                    logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            });
        });
    });
});