const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;

const { Gizil } = require('../../const/platforms');
const { favorit } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { init } = require('../../const/spinPlatform');
const { checkWin1 } = require('../../const/function');
const { Dev } = require('../../const/platforms');

chai.use(chaiHttp);

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


let { urlSpin, urlInit, token, gamesDate, bets } = Dev;


describe.skip('Test win', () => {

    let { id, lines } = gamesDate[0];

    before("Init", async() => {
        try {
            let responce = await init(urlInit, token, id);
            let { res, actionSpin } = responce;
            console.log(res.context.current + "   type of Init");
            logger.info(res);

            let file = { balance: res.user.balance, actionSpin };
            await fs.writeFile('db1.json', JSON.stringify(file));
            logger.info("Type of win is correct");

        } catch (error) {
            let { code, message } = error;
            console.log(code + "  code");
            console.log(message + "  message");
            logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
            logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
        }
    });

    bets.forEach((elbet) => {
        it('check withdraw a different bets from the balance, check all bets in platform',
            async() => {
                const file = await fs.readFile('db1.json', 'utf8');
                const obj = JSON.parse(file);
                let { actionSpin } = obj;

                console.log(` actionSpin ${actionSpin}`);
                console.log(` elbet ${elbet}`);

                if (actionSpin === "freespin") {
                    let action = "freespin";
                    while (action === "freespin") {
                        try {
                            let responce = await spin(urlSpin, token, id, elbet, lines);
                            let { actionSpin, res } = responce;
                            action = actionSpin;
                            console.log(res);
                            console.log(`actionSpin ${actionSpin}`);
                            console.log(`action ${action}`);
                            let file = { balance: res.user.balance, actionSpin };
                            await fs.writeFile('db1.json', JSON.stringify(file));
                        } catch (error) {
                            console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                            logger.info('!!!!!!ERROR in before block!!!!!! ' + error);

                        }
                    }

                } else {
                    try {
                        let responce = await spin(urlSpin, token, id, elbet, lines);
                        let { actionSpin, res } = responce;
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

                            let file = { balance: newBalance, actionSpin };
                            await fs.writeFile('db1.json', JSON.stringify(file));
                            logger.info(`rightBalans ${rightBalance}`);
                            logger.info(`newBalance ${newBalance}`);
                            console.log(`rightBalans ${rightBalance}`);
                            console.log(`newBalance ${newBalance}`);

                        } else {
                            let rightBalance = balance - totalBet;
                            expect(rightBalance).to.equal(newBalance);

                            let file = { balance: newBalance, actionSpin };
                            await fs.writeFile('db1.json', JSON.stringify(file));
                            logger.info(`rightBalans ${rightBalance}`);
                            logger.info(`newBalance ${newBalance}`);
                            console.log(`rightBalans ${rightBalance}`);
                            console.log(`newBalance ${newBalance}`);
                        }

                    } catch (error) {
                        console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                        logger.info('!!!!!!ERROR in before block!!!!!! ' + error);

                    }
                }
            });
    });
});