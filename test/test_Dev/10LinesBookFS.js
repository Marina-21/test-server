const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

// const { freespin } = require('../const/spin');
const { freespin, spinbeforFS } = require('../const/spinPlatform');
const { checkWin1, PaytableCoef, readToken, betLines, checkWild, winRight, checkTypeWin } = require('../const/function');
const { paytable10LinesBook } = require('../const/Paytable');
const { lines20 } = require('../const/lines');
const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../const/platforms');

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
let { id, lines, name, betUkr, betTR } = gamesDate[24];

let elbet = gamesDate[24][bet][2];
let token;
let cheat = "11DA1CBFCAIDD1A";

let actionSpin = "spin";

for (let i = 10; i >= 0; i--) {
    describe.only(`Test game: ${name} - ${i}`, function() {
        let globalDate = {
            oldFsWin: 0,
            oldTotal: 0,
            oldBalance: 0,
        };

        let data = {
            matrix: null,
            EWSymbol: null,
            isWinScater: false,
            winLinesWithoutScatter: null,
            allWinLines: null,
            actionSpin: null,
            total: 0,
            add: 0,
            rest: 0,
            fsWin: 0,
            balance: 0,
            actionNow: null,
            positionWild: null,
            res: null,
            invertMatrix: null
        };
        before("Spin", async() => {
            if (i >= 10 && actionSpin == "spin") {
                try {
                    let token = await readToken(nameToken);
                    const responce = await spinbeforFS(urlSpin, token, id, lines, elbet, cheat);
                    console.log(`${urlSpin}`);
                    let { actionSpin, res } = responce;
                    logger.info(`Test 20 Lines:game: ${name}, ${id} - ${i}`);
                    console.log(res);
                    console.log(res.context.win);
                    console.log((res.context.expendingWin));
                    console.log(`actionSpin ${ actionSpin }`);
                    console.log(res.context.current);
                    console.log(res.context.freespins.count);
                    logger.info(res);
                    logger.info(`actionSpin ${ actionSpin }`);
                    logger.info(res.context.win);
                    logger.info(res.context.expendingWin);
                    logger.info(res.context.matrix);

                    let matrix = res.context.matrix;
                    console.log(matrix);
                    const funcResultWin = checkWin1(res);
                    let actionNow = res.context.current;

                    const balance = res.user.balance;
                    data = {...data, res, matrix, balance, actionSpin, actionNow };

                    if (res.context.hasOwnProperty("freespins") && actionNow !== "spin") {
                        const EWSymbol = res.context.freespins.expendingSymbol;
                        const numberEWSymbol = matrix.flat().filter(symbol => symbol === EWSymbol).length;
                        const minKoefEWSymbol = Object.keys(paytable10LinesBook[EWSymbol])[0];
                        if (numberEWSymbol >= minKoefEWSymbol) {
                            const newMatrix = [];
                            matrix.forEach(el => {
                                let tempSymbol = el.filter(symbol => symbol === EWSymbol);
                                if (tempSymbol.length >= 1) {
                                    newMatrix.push([EWSymbol, EWSymbol, EWSymbol]);
                                } else {
                                    newMatrix.push(el);
                                }
                            });
                            const invertMatrix = newMatrix[0].map(el => { return []; });
                            newMatrix.forEach(row => {
                                row.forEach((el, index) => {
                                    invertMatrix[index].push(el);
                                });
                            });

                            data = {...data, invertMatrix };
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

                    if (res.context.hasOwnProperty("freespins")) {
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
            } else {
                try {
                    let token = await readToken(nameToken);
                    const responce = await freespin(urlSpin, token, id, lines, elbet);
                    console.log(`${urlSpin}`);
                    let { actionSpin, res } = responce;
                    logger.info(`Test 20 Lines:game: ${name}, ${id} - ${i}`);
                    console.log(res);
                    console.log(res.context.win);
                    console.log((res.context.expendingWin));
                    console.log(`actionSpin ${ actionSpin }`);
                    console.log(res.context.current);
                    logger.info(res);
                    logger.info(`actionSpin ${ actionSpin }`);
                    logger.info(res.context.win);
                    logger.info((res.context.expendingWin));
                    logger.info(res.context.matrix);
                    console.log(res.context.freespins.count);

                    let matrix = res.context.matrix;
                    console.log(matrix);
                    const funcResultWin = checkWin1(res);
                    let actionNow = res.context.current;

                    const balance = res.user.balance;
                    data = {...data, res, matrix, balance, actionSpin, actionNow };

                    if (res.context.hasOwnProperty("freespins") && actionNow !== "spin") {
                        const EWSymbol = res.context.freespins.expendingSymbol;
                        const numberEWSymbol = matrix.flat().filter(symbol => symbol === EWSymbol).length;
                        const minKoefEWSymbol = Object.keys(paytable10LinesBook[EWSymbol])[0];
                        if (numberEWSymbol >= minKoefEWSymbol) {
                            const newMatrix = [];
                            matrix.forEach(el => {
                                let tempSymbol = el.filter(symbol => symbol === EWSymbol);
                                if (tempSymbol.length === 1) {
                                    newMatrix.push([EWSymbol, EWSymbol, EWSymbol]);
                                } else {
                                    newMatrix.push(el);
                                }
                            });
                            const invertMatrix = newMatrix[0].map(el => { return []; });
                            newMatrix.forEach(row => {
                                row.forEach((el, index) => {
                                    invertMatrix[index].push(el);
                                });
                            });

                            data = {...data, invertMatrix };
                        }
                    }

                    if (funcResultWin !== null && funcResultWin.allWinLines.length !== 0) {
                        let winLinesWithoutScatter = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);

                        if (funcResultWin.allWinLines[0].id == null) {
                            let isWinScatter = true;
                            let winLinesScatter = funcResultWin.allWinLines[0];
                            data = {...data, isWinScatter, winLinesScatter };
                        }
                        data = {...data, winLinesWithoutScatter, ...funcResultWin };
                    }

                    if (res.context.hasOwnProperty("freespins")) {
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
            }
        });
        it('check response has expendingWin if there is feature "ESymbol"', function() {
            let { res, invertMatrix } = data;
            if (res.context.hasOwnProperty("expendingWin")) {
                logger.info('check response has expendingWin if there is feature "ESymbol"');
                logger.info(`wildInSpin - ${ invertMatrix }`);
                console.log(`wildInSpin - ${ invertMatrix }`);
                expect(invertMatrix).not.to.equal(null);
            }
        });
        it('check response has ESymbol if there is feature "expendingWin"', function() {
            let { res, invertMatrix } = data;
            if (invertMatrix != null) {
                logger.info('check response has ESymbol if there is feature "expendingWin"');
                logger.info(`wildInSpin - ${ invertMatrix }`);
                console.log(`wildInSpin - ${ invertMatrix }`);
                let B = res.context.hasOwnProperty("expendingWin");
                console.log(B);
                expect(res.context.hasOwnProperty("expendingWin")).to.eql(true);
            }
        });
        it('check ESymbol is not wild/scatter', function() {
            let { res } = data;
            if (res.context.hasOwnProperty("freespins")) {
                logger.info('check ESymbol is not wild/scatter');
                const ESymbol = res.context.freespins.expendingSymbol;
                logger.info(`ESymbol - ${ ESymbol }`);
                console.log(`ESymbol - ${ ESymbol }`);
                expect(ESymbol).not.to.equal("1");
            }
        });
        it('check new matrix with ESymbol is correct', function() {
            let { res, invertMatrix } = data;
            if (invertMatrix != null) {
                logger.info('check new matrix with ESymbol is correct');
                invertMatrix.forEach((el, index) => {
                    const value = _.isEqual(el, res.context.expendingWin.matrix[index]);
                    expect(value).to.be.true;

                });
                logger.info(`wildInSpin - ${ invertMatrix }`);
                console.log(`wildInSpin - ${ invertMatrix }`);
                expect(res.context.hasOwnProperty("expendingWin")).to.eql(true);
            }
        });
        it('check correct accrual of winnings ESymbol', () => {
            let { res, invertMatrix } = data;
            if (invertMatrix != null) {
                logger.info('check correct accrual of winnings');
                let bet = res.context.bet;
                const winESymbol = res.context.expendingWin.win;
                const ESymbol = res.context.freespins.expendingSymbol;

                let rightAmount = winRight(winESymbol.lines[0].positions, paytable10LinesBook, ESymbol, bet) * res.context.lines;
                console.log(rightAmount);
                console.log(winESymbol.total + " amount " + rightAmount + " rightAmount");
                logger.info(winESymbol.total + " amount " + rightAmount + " rightAmount");

                expect(winESymbol.total).to.be.equal(rightAmount);
            };
        });
        it('check correct accrual of winnings', () => {
            let { res, winLinesWithoutScatter, allWinLines, actionNow } = data;
            if (allWinLines !== null && !res.context.hasOwnProperty("freespins")) {
                logger.info('check correct accrual of winnings');
                let bet = res.context.bet;
                winLinesWithoutScatter.forEach((el) => {
                    console.log(el.positions);
                    console.log(el.symbol + " winSymbol");
                    logger.info(el.positions);
                    logger.info(el.symbol + " winSymbol");

                    function winRight() {
                        return PaytableCoef(el.positions, paytable10LinesBook, el.symbol) * bet;
                    }
                    let rightAmount = winRight();
                    console.log(el.amount + " amount " + rightAmount + " rightAmount");
                    logger.info(el.amount + " amount " + rightAmount + " rightAmount");

                    expect(el.amount).to.be.equal(rightAmount);
                });
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionNow, invertMatrix, res } = data;
            let { oldFsWin } = globalDate;

            if (actionNow === "freespin") {
                if (allWinLines !== null || (invertMatrix !== null)) {
                    logger.info('check correct accrual fsWin');
                    let totalWin = 0;
                    if (allWinLines !== null) {
                        let totalAmount = allWinLines.reduce((total, elLines) => total + elLines.amount, 0);

                        console.log(`${ totalAmount } - totalAmount`);
                        logger.info(`${ totalAmount } - totalAmount`);

                        totalWin = totalWin + totalAmount;
                    }
                    if ((invertMatrix !== null)) {
                        let totalESymbol = res.context.expendingWin.win.total;
                        totalWin = totalWin + totalESymbol;
                    }
                    console.log(`${ fsWin } - fsWin/ ${ oldFsWin } + ${ totalWin } - oldFsWin + totalWin `);
                    logger.info(`${ fsWin } - fsWin /${ oldFsWin } + ${ totalWin } - oldFsWin + totalWin `);

                    expect(fsWin).to.equal(oldFsWin + totalWin);
                } else {
                    console.log(`${ fsWin } - fsWin / ${ oldFsWin } - oldFsWin `);
                    logger.info(`${ fsWin } - fsWin / ${ oldFsWin } - oldFsWin `);
                    expect(fsWin).to.equal(oldFsWin);
                }
            }
        });

        it('check total amount is correct', () => {
            let { allWinLines, res } = data;
            if (allWinLines !== null) {
                logger.info('check total amount is correct');
                let rightTotalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                logger.info(`rightTotalAvount - ${rightTotalAmount}`);
                console.log(`rightTotalAvount - ${rightTotalAmount}`);
                expect(rightTotalAmount).to.be.equal(res.context.win.total);
            }
        });
        it('Winning Line coordinates from response is correct', async() => {
            let { winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                logger.info('Winning Line coordinates from response is correct');
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    logger.info(`winPositions-${winPositions}`);
                    console.log(`winPositions-${winPositions}`);
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
        it('check correct accrual of winnings in FS * 3', () => {
            let { res, winLinesWithoutScatter, rest, total } = data;

            if (res.context.hasOwnProperty("freespins") && winLinesWithoutScatter !== null) {
                if (total !== 10 && rest !== 10) {
                    logger.info('check correct accrual of winnings in FS * 3');
                    let bet = res.context.bet;

                    winLinesWithoutScatter.forEach((el) => {
                        const winPositions = el.positions;
                        console.log(winPositions);
                        logger.info(`winPositions - ${ winPositions }`);
                        const winSymbol = el.symbol;
                        console.log(winSymbol);
                        logger.info(`winSymbol - ${ winSymbol }`);
                        const amount = el.amount;

                        let rightAmount = winRight(winPositions, paytable10LinesBook, winSymbol, bet);

                        let fsWinRigt = (rightAmount);
                        console.log(fsWinRigt);
                        console.log(amount);
                        logger.info(`fsWinRigt - ${ fsWinRigt }`);
                        logger.info(`amount - ${ amount }`);

                        expect(amount).to.be.equal(fsWinRigt);
                    });
                }
            }
        });
        it('check correct wining symbol position Scatter', function() {
            let { matrix, winLinesScatter, isWinScatter, allWinLines, } = data;
            if (allWinLines !== null && isWinScatter == true) {
                logger.info('check correct wining symbol position Scatter');

                const positionSymbols = winLinesScatter.positions;
                const symbol = 1;
                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                    logger.info(`rightSymbol - ${tempSymbols}`);
                    expect(symbol).to.be.equal(Number(tempSymbols));
                });
                console.log("position of wining Scatter is corect");
                logger.info("position of wining Scatter is corect");
            }
        });
        it('check correct wining symbol position', function() {
            let { matrix, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                logger.info('check correct wining symbol position');
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    logger.info(`winSymbol - ${winSymbol}`);

                    winPositions.forEach((el) => {
                        const tempSymbols = matrix[el[0]][el[1]];
                        if (tempSymbols !== "1") {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            console.log(`rightSymbol - ${tempSymbols}`);
                            (`rightSymbol - ${tempSymbols}`);
                            expect(winSymbol).to.be.equal(tempSymbols);
                        } else {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            console.log(`rightSymbol - ${tempSymbols}`);

                            expect("1").to.equal(tempSymbols);
                        }
                    });
                });
            }
        });
        it('check total amount ESymbol is correct', () => {
            let { res, invertMatrix } = data;
            if (invertMatrix !== null) {
                logger.info('check total amount ESymbol is correct');
                let totalESymbol = res.context.expendingWin.win.lines;
                let rightTotalAmount = totalESymbol.reduce((total, lines) => total + lines.amount, 0);
                logger.info(`rightTotalAvount - ${rightTotalAmount}`);
                console.log(`rightTotalAvount - ${rightTotalAmount}`);
                console.log(`total - ${res.context.expendingWin.win.total}`);

                expect(rightTotalAmount).to.equal(res.context.expendingWin.win.total);
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

                if (arrScatter.length >= 3) {
                    oldTotal = total + 10;
                    add = 10;
                    data = {...data, add, oldTotal };
                    i = i + 10;
                    console.log(add + " add ");
                    logger.info(add + " add ");
                    expect(add).to.be.equal(10);
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
                if (add === 10) {
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
        it('check correct accrual Scatter in FS * 3', function() {
            let { res, winLinesScatter, total, isWinScatter } = data;
            if (res.context.hasOwnProperty("freespins") && isWinScatter == true) {
                if (total !== 10) {
                    logger.info('check correct accrual Scatter in FS * 3');
                    const bet = betLines(res);
                    const scatterSymbol = 1;
                    const amount = winLinesScatter.amount;
                    const winPositions = winLinesScatter.positions;
                    console.log(winLinesScatter);
                    logger.info(winLinesScatter);

                    let rightAmount = winRight(winPositions, paytable10LinesBook, scatterSymbol, bet);
                    console.log(`scatter is accrualed correct ${amount } - amount
             /${ rightAmount } - rightAmount `);
                    logger.info(`scatter is accrualed correct ${amount } - amount 
            /${ rightAmount } - rightAmount `);

                    expect(amount).to.be.equal(rightAmount);
                }
            }
        });
        it('balance is not change', function() {
            const { rest, balance, actionNow } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin" && rest > 0) {
                logger.info('balance is not change');

                console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
                logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance `);

                expect(balance).to.be.equal(oldBalance);
            }
        });
        it('check rest FS', function() {
            const { add, rest, actionNow } = data;
            const oldRest = globalDate.oldRest;

            if (actionNow == "freespin") {
                logger.info('check rest FS');
                let rightRest = null;
                if (add > 0) {
                    rightRest = oldRest - 1 + 10;
                } else {
                    rightRest = oldRest - 1;
                }
                console.log(` ${ rightRest } - rightRest `);
                logger.info(` ${ rightRest } - rightRest `);

                expect(rest).to.be.equal(rightRest);
            }
        });
        it('check correct add fsWin to balance', function() {
            let { res, add, rest, fsWin, balance, actionSpin } = data;
            let { oldBalance } = globalDate;

            if (res.context.hasOwnProperty("freespins")) {
                logger.info('check correct add fsWin to balance');
                if (rest == 0 && add == 0 && actionSpin === "spin") {
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
        it("check type of win 10 Lines", () => {
            let { allWinLines, res } = data;

            if (allWinLines !== null) {
                logger.info("check type of win 10 Lines");
                const gameTypeWin = res.context.win.type;

                let rightTypeWin = checkTypeWin(res);

                logger.info(`${rightTypeWin} - rightTypeWin`);

                expect(gameTypeWin).to.eql(rightTypeWin);
                logger.info("Type of win is correct");
            }
        });
        it("check type of win 10 Lines in ESymbol", () => {
            let { res } = data;

            if (res.context.hasOwnProperty("freespins") && res.context.hasOwnProperty("expendingWin")) {
                logger.info("check type of win 10 Lines");
                const gameTypeWin = res.context.expendingWin.win.type;

                let checkTypeWin2 = function(res) {
                    const totalWin = res.context.expendingWin.win.total;
                    const bet = betLines(res);
                    const typeCoef = totalWin / bet;
                    console.log((typeCoef) + " - typeCoef");
                    logger.info(`${typeCoef} - typeCoef`);

                    if (typeCoef < 10) {
                        return "regular";
                    } else if (typeCoef >= 10 && typeCoef < 100) {
                        return "big";
                    } else if (typeCoef >= 100 && typeCoef < 500) {
                        return "ultra";
                    } else if (typeCoef >= 500 && typeCoef <= 1500) {
                        return "mega";
                    }
                };
                let rightTypeWin = checkTypeWin2(res);

                logger.info(`${rightTypeWin} - rightTypeWin`);

                expect(gameTypeWin).to.eql(rightTypeWin);
                logger.info("Type of win is correct");
            }
        });
        after("wright", async() => {
            let { rest, res } = data;
            // let nextSpin = res.context.actions;

            if (res.context.hasOwnProperty("freespins")) {
                if (rest >= 0) {
                    let oldRest = res.context.freespins.count.rest;
                    let oldTotal = res.context.freespins.count.total;
                    let oldFsWin = res.context.freespins.win;
                    let oldBalance = res.user.balance;
                    globalDate = { oldRest, oldTotal, oldFsWin, oldBalance };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));
                } else {
                    let oldFsWin = 0;
                    globalDate = {...globalDate, oldFsWin };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));
                }
            }
        });
    });
}