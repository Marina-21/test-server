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


const { checkWin1, readToken } = require('../../const/function');
const { init, spin } = require('../../const/spinPlatform');
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

let { urlSpin, urlInit, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
const [nameGame] = [process.env.GAME];

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];
let elbet = gamesDate[game.number][bet][2];

for (let i = 0; i < 100; i++) {
    describe.only(`Test restore  ${name}: ${i}`, () => {

        let data = {
            resSpin: null,
            resInit: null,
            token: null,
            funcResultWin: null,
            featureEW: false,
            featureMult: false

        };

        before("Spin", async() => {
            try {
                let token = await readToken(nameToken);
                const response = await spin(urlSpin, token, id, elbet, lines);
                let resSpin = response.res;
                console.log(urlSpin);
                console.log(resSpin);
                logger.info(`Test restore ${name}: - ${i}`);
                logger.info(resSpin);

                let funcResultWin = checkWin1(resSpin);
                data = {
                    resSpin,
                    funcResultWin,
                    token
                };
                if (resSpin.context.hasOwnProperty("feature")) {
                    if (resSpin.context.feature.hasOwnProperty("expendingWild")) {
                        let featureEW = true;
                        data = {...data, featureEW };
                    }
                }
                if (resSpin.context.hasOwnProperty("feature")) {
                    if (resSpin.context.feature.hasOwnProperty("multiplier")) {
                        let featureMult = true;
                        data = {...data, featureMult };
                    }
                }

            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it("init", async() => {
            let { token } = data;
            const response = await init(urlInit, token, id);
            let resInit = response.res;
            console.log(resInit);
            data = {...data, resInit };
        });
        it("current", () => {
            let { resSpin, resInit } = data;

            console.log(`${resSpin.context.current} = ${resInit.context.current}`);
            expect(resSpin.context.current).to.eql(resInit.context.current);

        });
        it("actions", () => {
            let { resSpin, resInit } = data;
            let [actionsSpin] = resSpin.context.actions;
            let [actionsInit] = resInit.context.actions;

            console.log(`${actionsSpin} = ${actionsSpin}`);
            expect(actionsSpin).to.eql(actionsInit);
        });
        it("matrix", () => {
            let { resSpin, resInit } = data;
            let matrixSpin = resSpin.context.matrix;
            let matrixInit = resInit.context.matrix;

            console.log(`${matrixSpin} = ${matrixInit}`);
            const value = _.isEqual(matrixSpin, matrixInit);
            expect(value).to.be.true;
        });
        it("bet", () => {
            let { resSpin, resInit } = data;
            console.log(`${resSpin.context.bet} = ${resInit.context.bet}`);
            expect(resSpin.context.bet).to.eql(resInit.context.bet);
        });
        it("lines", () => {
            let { resSpin, resInit } = data;
            expect(resSpin.context.lines).to.eql(resInit.context.lines);
        });
        it("win.total", () => {
            let { resSpin, resInit, funcResultWin } = data;
            if (funcResultWin !== null) {

                console.log(`${resSpin.context.win.total} = ${resInit.context.win.total}`);
                expect(resSpin.context.win.total).to.eql(resInit.context.win.total);
            }
        });
        it("win.type", () => {
            let { resSpin, resInit, funcResultWin } = data;
            if (funcResultWin !== null) {

                console.log(`${resSpin.context.win.type} = ${resInit.context.win.type}`);
                expect(resSpin.context.win.type).to.eql(resInit.context.win.type);
            }
        });
        it("win.lines", () => {
            let { resSpin, resInit, funcResultWin } = data;
            if (funcResultWin !== null) {
                let allWinLinesInit = resInit.context.win.lines;
                let allWinLinesSpin = resSpin.context.win.lines;

                allWinLinesInit.forEach((lineInit, index) => {
                    expect(allWinLinesSpin[index].id).to.eql(lineInit.id);
                    console.log(`${allWinLinesSpin[index].id} = ${lineInit.id}`);

                    expect(allWinLinesSpin[index].amount).to.eql(lineInit.amount);
                    console.log(`${allWinLinesSpin[index].amount} = ${lineInit.amount}`);

                    const value = _.isEqual(allWinLinesSpin[index].positions, lineInit.positions);
                    console.log(`${allWinLinesSpin[index].positions} = ${lineInit.positions}`);
                    expect(value).to.be.true;

                    expect(allWinLinesSpin[index].symbol).to.eql(lineInit.symbol);
                    console.log(`${allWinLinesSpin[index].symbol} = ${lineInit.symbol}`);
                });
            }
        });
        it("check featureEW", () => {
            let { resSpin, resInit, featureEW } = data;
            if (featureEW == true) {
                let featureEWSpin = resSpin.context.feature.expendingWild;
                let featureEWInit = resInit.context.feature.expendingWild;

                expect(featureEWSpin.type).to.eql(featureEWInit.type);
                console.log(`${featureEWSpin.type} = ${featureEWInit.type}`);

                expect(featureEWSpin.winAmount).to.eql(featureEWInit.winAmount);
                console.log(`${featureEWSpin.winAmount} = ${featureEWInit.winAmount}`);

                const value = _.isEqual(featureEWSpin.positions, featureEWInit.positions);
                console.log(`${featureEWSpin.positions} = ${featureEWInit.positions}`);
                expect(value).to.be.true;

                expect(featureEWSpin.symbol).to.eql(featureEWInit.symbol);
                console.log(`${featureEWSpin.symbol} = ${featureEWInit.symbol}`);
            }
        });
        it("check featureMultiplier", () => {
            let { resSpin, resInit, featureMult } = data;
            if (featureMult == true) {
                let featureMultSpin = resSpin.context.feature.multiplier;
                let featureMultInit = resInit.context.feature.multiplier;

                expect(featureMultSpin.value).to.eql(featureMultInit.value);
                console.log(`${featureMultSpin.value} = ${featureMultInit.value}`);

                expect(featureMultSpin.win).to.eql(featureMultInit.win);
                console.log(`${featureMultSpin.win} = ${featureMultInit.win}`);
            }
        });
    });
}