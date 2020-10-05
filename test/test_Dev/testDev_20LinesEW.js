const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();


const { chekExpendingWild, checkWin1, PaytableCoef, betLines, checkTypeWin, readToken } = require('../../const/function');
const { paytable20LinesEW } = require('../../const/Paytable');
const { lines20 } = require('../../const/lines');
const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');

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

let { urlSpin, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
const [nameGame] = [process.env.GAME];
console.log(nameGame);

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });
console.log(indexGame);

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];
let elbet = gamesDate[game.number][bet][2];


for (let i = 0; i < 500; i++) {
    describe.only(`Test EW game: ${name} - ${i}`, function() {
        let globalDate = {
            oldBalance: 0,
            oldFsWin: 0,
            oldTotal: 0
        };

        let data = {
            matrix: null,
            wild: 2,
            newMatrix: null,
            featureEW: false,
            ExpWild: false,

            isWinScater: false,
            winLinesWithoutScatter: null,
            indexWild: null,
            allWinLines: null,
            actionSpin: null,
            total: 0,
            add: 0,
            rest: 0,
            fsWin: 0,
            balance: 0,
            actionNow: null
        };
        before("Spin", async() => {
            try {
                let token = await readToken(nameToken);
                const responce = await spin(urlSpin, token, id, elbet, lines);
                console.log(`${urlSpin}`);
                let { actionSpin, res } = responce;
                logger.info(`Test 20 Lines:game: ${name}, ${id} - ${i}`);
                console.log(res);
                console.log(`actionSpin ${ actionSpin }`);
                logger.info(res);
                logger.info(`actionSpin ${ actionSpin }`);

                let matrix = res.context.matrix;
                let funcResultExpW = chekExpendingWild(matrix);
                const funcResultWin = checkWin1(res);
                let actionNow = res.context.current;

                const balance = res.user.balance;
                data = {...data, res, matrix, ...funcResultExpW, balance, actionSpin, actionNow };

                if (res.context.hasOwnProperty("feature")) {
                    if (res.context.feature.hasOwnProperty("expendingWild")) {
                        let featureEW = true;
                        let obj = res.context.feature.expendingWild;
                        data = {...data, ...obj, featureEW };
                    }
                }

                if (funcResultWin !== null) {
                    let winLinesWithoutScatter = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);

                    if (funcResultWin.allWinLines[0].id == null) {
                        let isWinScatter = true;
                        let winLinesScatter = funcResultWin.allWinLines[0];
                        data = {...data, isWinScatter, winLinesScatter };
                    }
                    data = {...data, winLinesWithoutScatter, ...funcResultWin };
                }

                if (actionSpin == "freespin" || actionNow == "freespin") {
                    const obj = res.context.freespins.count;
                    console.log(obj.rest);
                    logger.info(obj.rest);
                    const fsWin = res.context.freespins.win;
                    const balance = res.user.balance;
                    data = {...data, ...obj, fsWin, balance };

                    const file = await fs.readFile('db.json', 'utf8');
                    const fileData = JSON.parse(file);
                    globalDate = {...fileData };
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('check wild is expending', function() {
            let { newMatrix, wild, } = data;
            let arrWild = [];
            logger.info('check wild is expending');

            newMatrix.forEach((el, index) => {
                let tempSymbol = el.filter(symbol => symbol == wild);
                if (tempSymbol.length == 3) {
                    console.log("matrix has expending wild " + (index + 1));
                    logger.info("matrix has expending wild " + (index + 1));
                } else {
                    arrWild.push(...tempSymbol);
                }
            });
            expect(arrWild.length).to.equal(0);
        });
        it('check the wild is not appeared in 1 and 5 reels', () => {
            let { ExpWild, indexWild } = data;
            if (ExpWild) {
                logger.info('check the wild is not appeared in 1 and 5 reels');
                let fistReels = indexWild.includes(0);
                let lastReels = indexWild.includes(4);
                logger.info(`fistReels - ${ fistReels }`);
                logger.info(`lastReels - ${ lastReels }`);
                expect(fistReels).to.be.equal(false);
                expect(lastReels).to.be.equal(false);
            }
        });
        it('check response has "expending Wild" if there is "feature', function() {
            let { featureEW, ExpWild } = data;
            if (featureEW == true) {
                logger.info('check response has "expending Wild" if there is "feature');
                logger.info(`ExpWild - ${ ExpWild }`);

                expect(ExpWild).to.be.equal(true);
            }
        });
        it('check response has "feature" if there is "expending Wild"', () => {
            let { featureEW, ExpWild } = data;
            if (ExpWild == true) {
                logger.info('check response has "feature" if there is "expending Wild"');
                logger.info(`featureEW - ${ featureEW }`);

                expect(featureEW).to.be.equal(true);
            }
        });
        it('check response hasn`t scatter in reels "expending Wild"', () => {
            let { ExpWild, matrix, indexWild } = data;
            if (ExpWild == true) {
                logger.info('check response hasn`t scatter in reels "expending Wild"');
                let arrScatter = [];
                indexWild.forEach((el) => {
                    matrix.id = matrix[el];
                    let tempSymbol = matrix.id.filter(symbol => symbol == 1);
                    arrScatter.push(...tempSymbol);
                });
                logger.info(`arrScatter.length- ${arrScatter.length} = 0`);

                expect(arrScatter.length).to.equal(0);
            }
        });
        it('check correct position of expending Wild', () => {
            let { featureEW, matrix, positions } = data;
            if (featureEW == true) {
                logger.info('check correct position of expending Wild');
                let wildPositions = [];

                matrix.forEach((el, index) => {
                    let getingposition = el.indexOf("2");
                    if (getingposition >= 0) {
                        wildPositions.push([index, getingposition]);
                    }
                });
                const value = _.isEqual(wildPositions, positions);
                console.log('wildPositions ' + [wildPositions] + '  positions feature ' + [positions]);
                logger.info(`wildPositions - ${wildPositions}/ positions feature - ${positions}`);

                expect(value).to.be.true;
            }
        });
        it('check correct accrual of winnings', () => {
            let { res, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                logger.info('check correct accrual of winnings');
                let bet = res.context.bet;
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    console.log(winPositions);
                    console.log(winSymbol + " winSymbol");
                    logger.info(winPositions);
                    logger.info(winSymbol + " winSymbol");

                    const amount = el.amount;

                    function winRight() {
                        return PaytableCoef(winPositions, paytable20LinesEW, winSymbol) * bet;
                    }
                    let rightAmount = winRight();
                    console.log(amount + " amount " + rightAmount + " rightAmount");
                    logger.info(amount + " amount " + rightAmount + " rightAmount");

                    expect(amount).to.be.equal(rightAmount);
                });
            }
        });
        it('check correct accrual Scatter', function() {
            let { res, winLinesScatter, isWinScatter, allWinLines, } = data;
            if (allWinLines !== null && isWinScatter == true) {
                logger.info('check correct accrual Scatter');
                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);
                logger.info(`winLinesScatter - ${winLinesScatter}`);

                const winRightNull = PaytableCoef(winPositions, paytable20LinesEW, symbol) * bet;

                console.log("scatter is accrualed correct" + amount + " amount" + winRightNull + "winRightNull");
                logger.info(`scatter is accrualed correct: amount-${amount}, winRightNull-${winRightNull}`);

                expect(amount).to.be.equal(winRightNull);
            }
        });
        it('check correct wining symbol position', function() {
            let { newMatrix, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                logger.info('check correct wining symbol position');
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    logger.info(`winSymbol - ${winSymbol}`);

                    winPositions.forEach((el) => {
                        const tempSymbols = newMatrix[el[0]][el[1]];
                        if (tempSymbols !== "2") {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            expect(winSymbol).to.be.equal(tempSymbols);
                        } else {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            expect("2").to.be.equal(tempSymbols);
                        }
                    });
                });
            }
        });
        it('check correct wining symbol position Scatter', function() {
            let { newMatrix, winLinesScatter, isWinScatter, allWinLines, } = data;
            if (allWinLines !== null && isWinScatter == true) {
                logger.info('check correct wining symbol position Scatter');

                const positionSymbols = winLinesScatter.positions;
                const symbol = 1;
                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = newMatrix[coordinate[0]][coordinate[1]];
                    logger.info(`rightSymbol - ${tempSymbols}`);
                    expect(symbol).to.be.equal(Number(tempSymbols));
                });
                console.log("position of wining Scatter is corect");
                logger.info("position of wining Scatter is corect");
            }
        });
        it('Winning Line coordinates from response is correct', async() => {
            let { winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                logger.info('Winning Line coordinates from response is correct');
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    logger.info(`winPositions-${winPositions}`);
                    const idLines = el.id;
                    const numberLines = lines20[idLines];
                    const coordinatesLines = numberLines.slice(0, winPositions.length);
                    logger.info(`rightPositions-${coordinatesLines}`);
                    const value = _.isEqual(winPositions, coordinatesLines);
                    expect(coordinatesLines.length).to.be.equal(winPositions.length);
                    expect(value).to.be.true;
                    // expect(numberLines.id).to.be.equal(idLines);
                });
            }
        });
        it('check total amount is correct', () => {
            let { allWinLines, res } = data;
            if (allWinLines !== null) {
                logger.info('check total amount is correct');
                let rightTotalAvount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                logger.info(`rightTotalAvount - ${rightTotalAvount}`);

                expect(rightTotalAvount).to.be.equal(res.context.win.total);
            }
        });
        it('check correct add count of FS', function() {
            let { matrix, add, total, oldTotal, actionNow } = data;
            if (actionNow == "freespin") {
                logger.info('check correct add count of FS');
                const arrScatter = [];

                matrix.forEach((el) => {
                    let getScatter = el.filter(value => value == 1);
                    if (getScatter.length > 0) {
                        arrScatter.push(...getScatter);
                    }
                });

                if (arrScatter.length > 2) {
                    oldTotal = total + 15;
                    add = 15;
                    data = {...data, add, oldTotal };
                    i = i + 15;
                    console.log(add + " add ");
                    logger.info(add + " add ");
                    expect(add).to.be.equal(15);
                } else {
                    console.log(add + " add");
                    logger.info(add + " add ");
                    expect(add).to.equal(+0);
                }
            }
        });
        it('check correct total FS', function() {
            const { add, total, actionNow } = data;
            if (actionNow == "freespin") {
                logger.info('check correct total FS ');
                const { oldTotal } = globalDate;
                if (add == 15) {
                    console.log(`${ oldTotal + add } - oldTotal FS + rest Fs ${ total } - total FS `);
                    logger.info(`${ oldTotal + add } - oldTotal FS + rest Fs ${ total } - total FS `);
                    expect(oldTotal + add).to.equal(total);
                } else {
                    console.log(` ${ oldTotal } - oldTotal FS ${ total } - total FS `);
                    logger.info(` ${ oldTotal } - oldTotal FS ${ total } - total FS `);
                    expect(+oldTotal).to.equal(+total);
                }
            }
        });
        it('check rest FS', function() {
            const { add, rest, actionNow } = data;
            const oldRest = globalDate.oldRest;

            if (actionNow == "freespin") {
                logger.info('check rest FS');
                let rightRest = null;
                if (add > 0) {
                    rightRest = oldRest - 1 + 15;
                } else {
                    rightRest = oldRest - 1;
                }
                console.log(` ${ rightRest } - rightRest `);
                logger.info(` ${ rightRest } - rightRest `);

                expect(rest).to.be.equal(rightRest);
            }
        });
        it('balance is not change', function() {
            const { rest, balance, actionNow } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {
                logger.info('balance is not change');
                if (rest > 0) {
                    console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
                    logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance `);

                    expect(balance).to.be.equal(oldBalance);
                }
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionNow } = data;
            let { oldFsWin } = globalDate;

            if (actionNow === "freespin") {
                logger.info('check correct accrual fsWin');
                if (allWinLines !== null) {

                    let totalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                    console.log(`${fsWin } - fsWin
                    / ${oldFsWin } + ${ totalAmount } - oldFsWin + totalAmount `);
                    logger.info(`${ fsWin } - fsWin
                    / ${ oldFsWin } + ${ totalAmount } - oldFsWin + totalAmount `);

                    expect(fsWin).to.be.equal(oldFsWin + totalAmount);
                } else {
                    console.log(`$ { fsWin } - fsWin / $ { oldFsWin } - oldFsWin`);
                    logger.info(`$ { fsWin } - fsWin / $ { oldFsWin }  - oldFsWin`);
                    expect(fsWin).to.be.equal(oldFsWin);
                }
            }
        });
        it('check correct add fsWin to balance', function() {
            let { actionNow, add, rest, fsWin, balance } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {
                logger.info('check correct add fsWin to balance');
                if (rest == 0 && add == 0) {
                    const rightBalance = oldBalance + fsWin;
                    console.log("!!! balance " + balance);
                    console.log("!!! rightBalance " + rightBalance);
                    console.log("!!! fsWin " + fsWin);
                    logger.info("!!! balance " + balance);
                    logger.info("!!! rightBalance " + rightBalance);
                    logger.info("!!! fsWin " + fsWin);

                    expect(balance).to.equal(rightBalance);
                }
            }
        });
        it("check type of win 20 Lines", () => {
            let { allWinLines, res } = data;

            if (allWinLines !== null) {
                logger.info("check type of win 20 Lines");
                const gameTypeWin = res.context.win.type;

                let rightTypeWin = checkTypeWin(res);

                logger.info(`${rightTypeWin} - rightTypeWin`);

                expect(gameTypeWin).to.eql(rightTypeWin);
                logger.info("Type of win is correct");
            }
        });
        after("wright", async() => {
            let { rest, res, actionSpin } = data;
            let nextSpin = res.context.actions;
            if (actionSpin == "freespin" || nextSpin == "freespin") {
                if (rest > 0) {
                    let oldRest = res.context.freespins.count.rest;
                    let oldTotal = res.context.freespins.count.total;
                    let oldFsWin = res.context.freespins.win;
                    let oldBalance = res.user.balance;
                    globalDate = {...globalDate, oldRest, oldTotal, oldFsWin, oldBalance };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));
                }
            }
        });
    });

}