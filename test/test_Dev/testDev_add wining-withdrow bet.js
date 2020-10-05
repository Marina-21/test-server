const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;
require('dotenv').config();


const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { checkWin1, readToken } = require('../../const/function');


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

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

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];
let elbet = gamesDate[game.number][bet][2];
console.log(elbet);

for (let i = 0; i < 100; i++) {
    describe.only(`test add wining-withdrow bet game: ${name} - ${i}`, () => {

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
                let token = await readToken(nameToken);
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { res, actionSpin } = responce;
                let actionNow = res.context.current;
                console.log(urlSpin);
                console.log(res);
                logger.info(`test add wining-withdrow bet: game: ${name} id-${id}, -  ${i}`);
                logger.info(res);

                console.log(`actionSpin  ${actionSpin}`);
                logger.info(`actionSpin  ${actionSpin}`);

                let newBalance = res.user.balance;
                const funcResult = checkWin1(res);
                let bet = res.context.bet * lines;
                logger.info(`bet ${bet}`);

                const file = await fs.readFile('db.json', 'utf8');
                const obj = JSON.parse(file);

                date = { funcResult, res, ...obj, actionSpin, actionNow, newBalance, bet };

            } catch (error) {
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it(' check add winning to balance  and withdrawing bet in Spin', async() => {
            let { res, funcResult, balance, actionSpin, actionNow, newBalance, bet } = date;
            if (actionNow == "spin" && actionSpin == "spin") {
                logger.info(' check add winning to balance  and withdrawing bet in Spin');

                if (funcResult !== null) {
                    let win = res.context.win.total;
                    let rightBalance = balance + win - bet;

                    let file = { balance: newBalance };
                    await fs.writeFile('db.json', JSON.stringify(file));

                    expect(rightBalance).to.equal(Number(newBalance));

                    console.log(`rightBalans ${rightBalance}`);
                    console.log(`newBalance ${newBalance}`);
                    logger.info(`rightBalans ${rightBalance}`);
                    logger.info(`newBalance ${newBalance}`);
                } else {
                    let rightBalance = balance - bet;

                    let file = { balance: newBalance };
                    await fs.writeFile('db.json', JSON.stringify(file));

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
                logger.info(' check add winning to balance  and withdrawing bet in start FS');

                let rightBalance = balance - bet;
                logger.info(`rightBalance- &{rightBalance}`);

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                expect(newBalance).to.equal(rightBalance);
            }
        });
        it(' check balance do not change respin => freespin', async() => {
            let { balance, actionSpin, actionNow, newBalance, res } = date;
            if (actionSpin == "freespin" && actionNow == "respin") {
                logger.info('check balance do not change respin => freespin');

                logger.info(`balance- &{balance}`);

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                expect(newBalance).to.equal(balance);
            }
        });
        it(' check add winning to balance  and withdrawing bet in end FS', async() => {
            let { res, balance, actionSpin, actionNow, newBalance } = date;
            if (actionSpin == "spin" && actionNow == "freespin") {
                logger.info('check add winning to balance and withdrawing bet in end FS ');
                let totalWinFS = res.context.freespins.win;
                let rightBalance = totalWinFS + balance;

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                expect(newBalance).to.equal(rightBalance);

                console.log(`rightBalans ${rightBalance}`);
                console.log(`newBalance ${newBalance}`);
                logger.info(`rightBalans ${rightBalance}`);
                logger.info(`newBalance ${newBalance}`);
            }
        });

        it(' check add winning to balance  and withdrawing bet in Freespin', async() => {
            let { balance, actionSpin, actionNow, newBalance } = date;
            if (actionSpin == "freespin" && actionNow == "freespin") {
                logger.info(' check add winning to balance  and withdrawing bet in Freespin');


                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                console.log(`rightBalans ${balance}`);
                console.log(`newBalance ${newBalance}`);
                logger.info(`rightBalans ${balance}`);
                logger.info(`newBalance ${newBalance}`);
                expect(balance).to.equal(Number(newBalance));
            }
        });
        it('balance is not change in freespin with respin', async() => {
            let { balance, actionSpin, actionNow, newBalance } = date;
            if (actionSpin == "respin" && actionNow == "freespin" || actionSpin == "freespin" && actionNow == "respin") {
                logger.info(' check add winning to balance  and withdrawing bet in Freespin');

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));
                console.log(`rightBalans ${balance}`);
                console.log(`newBalance ${newBalance}`);
                logger.info(`rightBalans ${balance}`);
                logger.info(`newBalance ${newBalance}`);

                expect(balance).to.equal(Number(newBalance));

            }
        });
        it('win is not added to balance before respin', async() => {
            const { balance, actionNow, actionSpin, res, newBalance } = date;
            if (actionNow === "spin" && actionSpin === "respin") {
                logger.info('win is not added to balance before respin');

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                const rightBalance = balance - res.context.bet * res.context.lines;
                console.log(` ${ newBalance } - balance / ${ balance } - oldBalance -  ${res.context.bet} * ${res.context.lines} `);
                logger.info(` ${ newBalance } - balance / ${ balance } - oldBalance -  ${res.context.bet} * ${res.context.lines}`);
                expect(rightBalance).to.be.equal(newBalance);
            }
        });
        it('respin win is added to balance', async() => {
            const { balance, actionNow, actionSpin, newBalance, res } = date;
            if (actionNow === "respin" && actionSpin === "spin") {
                const winRSpin = res.context.respin.total;
                logger.info('respin win is added to balance');
                const rightBalance = balance + winRSpin;
                console.log(` ${ balance } - balance / ${ balance } - oldBalance + ${winRSpin} `);
                logger.info(` ${ balance } - balance / ${ balance } - oldBalance  + ${winRSpin}`);

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                expect(rightBalance).to.be.equal(newBalance);
            }
        });
        it('balance is not change during respin', async() => {
            const { balance, actionNow, actionSpin, res, newBalance } = date;
            if (actionNow === "respin" && actionSpin === "respin") {
                console.log(` ${ balance } - balance / ${ newBalance } - oldBalance `);
                logger.info(` ${ balance } - balance / ${ newBalance } - oldBalance `);

                let file = { balance: newBalance };
                await fs.writeFile('db.json', JSON.stringify(file));

                expect(balance).to.be.equal(newBalance);
            }
        });
    });
}