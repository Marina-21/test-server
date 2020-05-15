const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;

const { FavoritSpin } = require('../const/platforms');
const { FavoritInit } = require('../const/platforms');
const { GizilSpin } = require('../const/platforms');
const { GizilInit } = require('../const/platforms');
const { DevSpin } = require('../const/platforms');
const { DevInit } = require('../const/platforms');
const { devBets } = require('../const/platforms');
const { GizilBets } = require('../const/platforms');
const { favoritBets } = require('../const/platforms');
const { gamesDate } = require('../const/platforms');
const { spin } = require('../const/spinPlatform');
const { init } = require('../const/spinPlatform');
const { checkWin1 } = require('../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBalance.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

chai.use(chaiHttp);

let { urlSpin, token } = DevSpin;
let gameObj = gamesDate[0];
let { id, lines } = gameObj;
let elbet = devBets[4];

for (let i = 0; i < 200; i++) {
    describe.only('Test win', () => {

        let date = {
            funcResult: null,
            res: null,
            balance: 0,
            actionSpin: spin,
            actionNow: null,
            newBalance: 0,
            bet: 0
        };
        before("Spin", async() => {
            try {
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { res, actionSpin } = responce;
                let actionNow = res.context.current;
                console.log(res);
                logger.info(`actionSpin ${actionSpin}`);
                let newBalance = res.user.balance;
                const funcResult = checkWin1(res);
                let bet = res.context.bet * lines;
                logger.info(`bet ${bet}`);

                const file = await fs.readFile('db1.json', 'utf8');
                const obj = JSON.parse(file);

                date = { funcResult, res, ...obj, actionSpin, actionNow, newBalance, bet };

            } catch (error) {

                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });

        it(' check add winning to balance  and withdrawing bet in Spin', async() => {
            let { res, funcResult, balance, actionSpin, actionNow, newBalance, bet } = date;
            if (actionNow == "spin" && actionSpin == "spin") {


                if (funcResult !== null) {
                    let win = res.context.win.total;
                    let rightBalance = balance + win - bet;

                    let file = { balance: newBalance };
                    await fs.writeFile('db1.json', JSON.stringify(file));

                    expect(rightBalance).to.equal(Number(newBalance));

                    console.log(`rightBalans ${rightBalance}`);
                    console.log(`newBalance ${newBalance}`);
                    logger.info(`rightBalans ${rightBalance}`);
                    logger.info(`newBalance ${newBalance}`);
                } else {
                    let rightBalance = balance - bet;

                    let file = { balance: newBalance };
                    await fs.writeFile('db1.json', JSON.stringify(file));

                    expect(rightBalance).to.equal(Number(newBalance));

                    console.log(`rightBalans ${rightBalance}`);
                    console.log(`newBalance ${newBalance}`);
                    logger.info(`rightBalans ${rightBalance}`);
                    logger.info(`newBalance ${newBalance}`);
                }
            }
        });
        it(' check add winning to balance  and withdrawing bet in start FS', async() => {
            let { balance, actionSpin, actionNow, newBalance, bet } = date;
            if (actionSpin == "freespin" && actionNow == "spin") {

                let rightBalance = balance - bet;

                let file = { balance: newBalance };
                await fs.writeFile('db1.json', JSON.stringify(file));

                expect(newBalance).to.equal(rightBalance);
            }
        });
        it(' check add winning to balance  and withdrawing bet in end FS', async() => {
            let { res, balance, actionSpin, actionNow, newBalance } = date;
            if (actionSpin == "spin" && actionNow == "freespin") {
                let totalWinFS = res.context.freespins.win;
                let rightBalance = totalWinFS + balance;

                let file = { balance: newBalance };
                await fs.writeFile('db1.json', JSON.stringify(file));

                expect(newBalance).to.equal(rightBalance);

                logger.info(`rightBalans ${rightBalance}`);
                logger.info(`newBalance ${newBalance}`);
            }
        });

        it(' check add winning to balance  and withdrawing bet in Freespin', async() => {
            let { balance, actionSpin, actionNow, newBalance } = date;
            if (actionSpin == "freespin" && actionNow == "freespin") {

                expect(balance).to.equal(Number(newBalance));

                logger.info(`rightBalans ${balance}`);
                logger.info(`newBalance ${newBalance}`);
            }
        });
    });
}