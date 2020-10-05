const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

// const { freespin } = require('../const/spin');
const { spin } = require('../../const/spinPlatform');
const { checkWin1, PaytableCoef, readToken, betLines, checkWild, winRight, checkTypeWin } = require('../../const/function');
const { paytable20LinesClover } = require('../../const/Paytable');
const { lines20 } = require('../../const/lines');
const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');

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
let { id, lines, name } = gamesDate[22];

let elbet = gamesDate[22][bet][2];
let token;

for (let i = 0; i < 1000; i++) {
    describe.only(`Test game: ${name} - ${i}`, function() {
        let globalDate = {
            oldFsWin: 0,
            oldTotal: 0,
        };
        let wildDate = {
            oldPositionWild: null,
            oldIndexWild: null,
            oldBalance: 0,
            oldWinRSpin: 0
        };

        let data = {
            matrix: null,
            wild: 2,
            winRSpin: null,
            wildInSpin: false,
            indexWild: null,
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
        };
        before("Spin", async() => {
            try {
                let token = await readToken(nameToken);
                const responce = await spin(urlSpin, token, id, elbet, lines);
                console.log(`${urlSpin}`);
                let { actionSpin, res } = responce;
                logger.info(`Test 20 Lines:game: ${name}, ${id} - ${i}`);
                console.log(res);
                console.log(res.context.win);
                console.log(`actionSpin ${ actionSpin }`);
                console.log(res.context.current);
                logger.info(res);
                logger.info(`actionSpin ${ actionSpin }`);
                logger.info(res.context.win);
                logger.info(res.context.matrix);

                let matrix = res.context.matrix;
                console.log(matrix);
                const funcResultWin = checkWin1(res);
                let funcResultRSpin = await checkWild(matrix);
                let actionNow = res.context.current;

                const balance = res.user.balance;
                data = {...data, ...funcResultRSpin, res, matrix, balance, actionSpin, actionNow };

                const file = await fs.readFile('db2.json', 'utf8');
                const { oldBalance } = JSON.parse(file);
                wildDate = {...wildDate, oldBalance };

                if (res.context.hasOwnProperty("respin")) {
                    let winRSpin = res.context.respin.total;
                    data = {...data, winRSpin };
                }

                if (funcResultRSpin.wildInSpin) {
                    const file = await fs.readFile('db2.json', 'utf8');
                    let { oldPositionWild, numberRSpin = 0, oldIndexWild, oldBalance, oldWinRSpin } = JSON.parse(file);
                    wildDate = {...wildDate, oldPositionWild, oldIndexWild, oldBalance, oldWinRSpin };

                    if (actionSpin === "respin") {
                        numberRSpin++;
                        console.log(`numberRSpin - ${ numberRSpin }`);
                    } else {
                        numberRSpin = 0;
                    }
                    data = {...data, numberRSpin };
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
                    data = {...data, ...obj, fsWin, balance };

                    const file = await fs.readFile('db.json', 'utf8');
                    const fileData = JSON.parse(file);
                    globalDate = {...fileData };
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('check the wild is not appeared in 1 and 5 reels', () => {
            let { indexWild, wildInSpin } = data;
            if (wildInSpin) {
                logger.info('check the wild is not appeared in 1 and 5 reels');
                let fistReels = indexWild.includes(0);
                let lastReels = indexWild.includes(4);
                logger.info(`fistReels - ${ fistReels }`);
                logger.info(`lastReels - ${ lastReels }`);
                console.log(wildInSpin);
                expect(fistReels).to.eql(false);
                expect(lastReels).to.eql(false);
            }
        });
        it('check response has wild if there is feature "respin"', function() {
            let { winRSpin, wildInSpin } = data;
            if (winRSpin !== null) {
                logger.info('check response has wild if there is feature "respin"');
                logger.info(`wildInSpin - ${ wildInSpin }`);
                console.log(`wildInSpin - ${ wildInSpin }`);
                expect(wildInSpin).to.eql(true);
            }
        });
        it('check response has feature "respin" if there is Wild', () => {
            let { winRSpin, wildInSpin } = data;
            if (wildInSpin) {
                logger.info('check response has feature "respin" if there is Wild');
                logger.info(`winRSpin - ${ winRSpin }`);
                console.log(`winRSpin - ${ winRSpin }`);
                expect(winRSpin).not.to.equal(null);
            }
        });
        it('check a maximum of 3 respins after a Wild activates a respin', () => {
            let { wildInSpin, numberRSpin } = data;
            if (wildInSpin) {
                logger.info('check a maximum of 3 respins after a Wild activates a respin');
                logger.info(`numberRSpin - ${ numberRSpin }`);
                console.log(numberRSpin);
                expect(numberRSpin).not.to.equal(4);
            }
        });
        it('check correct position of Wild in respin', () => {
            let { actionNow, positionWild } = data;
            let { oldPositionWild } = wildDate;
            if ((actionNow === 'respin')) {
                // if (indexWild.length !== oldIndexWild.length) {
                //     indexWild.forEach(el => {
                //         const reelWild = matrix[el];
                //         const value = _.isEqual(oldPositionWild, reelWild);
                //         expect(value).to.be.true;
                //     });

                oldPositionWild.forEach(el => {
                    const isFind = positionWild.find((elNew) => {
                        return elNew.index === el.index && _.isEqual(elNew.symbol, el.symbol);
                    });
                    logger.info('check correct position of Wild in respin');
                    logger.info(oldPositionWild - oldPositionWild);
                    logger.info(positionWild);
                    console.log(oldPositionWild);
                    console.log(positionWild);
                    expect(isFind).not.to.equal(undefined);
                });
            }
        });
        it('win is not added to balance before respin', function() {
            const { balance, actionNow, actionSpin, res } = data;
            let { oldBalance } = wildDate;
            if (actionNow === "spin" && actionSpin === "respin") {
                logger.info('win is not added to balance before respin');
                const newBalance = oldBalance - res.context.bet * res.context.lines;
                console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance -  ${res.context.bet} * ${res.context.lines} `);
                logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance -  ${res.context.bet} * ${res.context.lines}`);
                expect(balance).to.be.equal(newBalance);
            }
        });
        it('respin win is added to balance', function() {
            const { balance, actionNow, actionSpin, winRSpin } = data;
            let { oldBalance } = wildDate;
            if (actionNow === "respin" && actionSpin === "spin") {
                logger.info('respin win is added to balance');
                const newBalance = oldBalance + winRSpin;
                console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance + ${winRSpin} `);
                logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance  + ${winRSpin}`);
                expect(balance).to.be.equal(newBalance);
            }
        });
        it('balance is not change during respin', function() {
            const { balance, actionNow, actionSpin, res, winRSpin } = data;
            let { oldBalance } = wildDate;
            if (actionNow === "respin" && actionSpin === "respin") {
                console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
                logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
                expect(balance).to.be.equal(oldBalance);
            }
        });
        it(' check balance do not change respin => freespin', async() => {
            let { balance, actionSpin, actionNow } = data;
            let { oldBalance } = wildDate;
            if (actionSpin == "freespin" && actionNow == "respin") {
                logger.info('check balance do not change respin => freespin');
                logger.info(`balance- &{balance}`);
                logger.info(`balance- &{balance}`);
                expect(balance).to.equal(oldBalance);
            }
        });
        it('check correct accrual WinRSpin', function() {
            let { winRSpin, allWinLines, actionNow, actionSpin, res } = data;
            let { oldWinRSpin } = wildDate;

            if (actionNow == "respin" || actionSpin === "respin" && !res.context.hasOwnProperty("freespins")) {
                logger.info('check correct accrual fsWin');
                if (allWinLines !== null) {
                    // let totalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                    let totalAmount = res.context.win.total;
                    console.log(`${winRSpin } - winRSpin/ ${oldWinRSpin } + ${ totalAmount } - oldWinRSpin + totalAmount `);
                    logger.info(`${ winRSpin } - winRSpin/ ${ oldWinRSpin } + ${ totalAmount } - oldWinRSpin + totalAmount `);

                    expect(winRSpin).to.be.equal(oldWinRSpin + totalAmount);
                } else {
                    console.log(`${winRSpin } - winRSpin / ${ oldWinRSpin } - oldWinRSpin`);
                    logger.info(`${winRSpin } - winRSpin / ${ oldWinRSpin }  - oldWinRSpin`);
                    expect(winRSpin).to.be.equal(oldWinRSpin);
                }
            }
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
                        return PaytableCoef(el.positions, paytable20LinesClover, el.symbol) * bet;
                    }
                    let rightAmount = winRight();
                    console.log(el.amount + " amount " + rightAmount + " rightAmount");
                    logger.info(el.amount + " amount " + rightAmount + " rightAmount");

                    expect(el.amount).to.be.equal(rightAmount);
                });
            }
        });
        it('check correct accrual Scatter', function() {
            let { res, winLinesScatter, isWinScatter, allWinLines, actionNow } = data;
            if (allWinLines !== null && isWinScatter == true && actionNow === "spin") {
                logger.info('check correct accrual Scatter');
                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);
                logger.info(`winLinesScatter - ${winLinesScatter}`);

                const winRightNull = PaytableCoef(winPositions, paytable20LinesClover, symbol) * bet;

                console.log("scatter is accrualed correct" + amount + " amount" + winRightNull + "winRightNull");
                logger.info(`scatter is accrualed correct: amount-${amount}, winRightNull-${winRightNull}`);

                expect(amount).to.be.equal(winRightNull);
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
                        if (tempSymbols !== "2") {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            console.log(`rightSymbol - ${tempSymbols}`);
                            (`rightSymbol - ${tempSymbols}`);
                            expect(winSymbol).to.be.equal(tempSymbols);
                        } else {
                            logger.info(`rightSymbol - ${tempSymbols}`);
                            console.log(`rightSymbol - ${tempSymbols}`);

                            expect("2").to.be.equal(tempSymbols);
                        }
                    });
                });
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
        it('check correct accrual of winnings in FS * 3', () => {
            let { res, winLinesWithoutScatter, rest, total } = data;

            if (res.context.hasOwnProperty("freespins") && winLinesWithoutScatter !== null) {
                if (total !== 17 && rest !== 17) {
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

                        let rightAmount = winRight(winPositions, paytable20LinesClover, winSymbol, bet);

                        let fsWinRigt = (rightAmount * 3);
                        console.log(fsWinRigt);
                        console.log(amount);
                        logger.info(`fsWinRigt - ${ fsWinRigt }`);
                        logger.info(`amount - ${ amount }`);

                        expect(amount).to.be.equal(fsWinRigt);
                    });
                }
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
        it('check total amount is correct', () => {
            let { allWinLines, res } = data;
            if (allWinLines !== null) {
                logger.info('check total amount is correct');
                let rightTotalAvount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                logger.info(`rightTotalAvount - ${rightTotalAvount}`);
                console.log(`rightTotalAvount - ${rightTotalAvount}`);

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

                if (arrScatter.length === 2) {
                    oldTotal = total + 17;
                    add = 17;
                    data = {...data, add, oldTotal };
                    i = i + 17;
                    console.log(add + " add ");
                    logger.info(add + " add ");
                    expect(add).to.be.equal(17);
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
                if (add == 17) {
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
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionNow, actionSpin, res } = data;
            let { oldFsWin } = globalDate;

            if (actionNow === "freespin") {
                if (allWinLines !== null) {
                    logger.info('check correct accrual fsWin');
                    let totalAmount = allWinLines.reduce((total, elLines) => total + elLines.amount, 0);
                    console.log(`${ fsWin } - fsWin/ ${ oldFsWin } + ${ totalAmount } - oldFsWin + totalAmount `);
                    logger.info(`${ fsWin } - fsWin /${ oldFsWin } + ${ totalAmount } - oldFsWin + totalAmount `);

                    expect(fsWin).to.be.equal(oldFsWin + totalAmount);
                } else {
                    console.log(`${ fsWin } - fsWin / ${ oldFsWin } - oldFsWin `);
                    logger.info(`${ fsWin } - fsWin / ${ oldFsWin } - oldFsWin `);
                    expect(fsWin).to.be.equal(oldFsWin);
                }
            }
        });
        it('check correct accrual Scatter in FS * 3', function() {
            let { res, winLinesScatter, total, isWinScatter } = data;
            if (res.context.hasOwnProperty("freespins") && isWinScatter == true) {
                if (total !== 17) {
                    logger.info('check correct accrual Scatter in FS * 3');
                    const bet = betLines(res);
                    const scatterSymbol = 1;
                    const amount = winLinesScatter.amount;
                    const winPositions = winLinesScatter.positions;
                    console.log(winLinesScatter);
                    logger.info(winLinesScatter);

                    let rightAmount = winRight(winPositions, paytable20LinesClover, scatterSymbol, bet) * 3;
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
        it('balance is not change in freespin with respin', async() => {
            let { balance, actionSpin, actionNow } = data;
            let { oldBalance } = wildDate;
            if (actionSpin == "respin" && actionNow == "freespin" || actionSpin == "freespin" && actionNow == "respin") {
                logger.info('balance is not change');

                console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
                logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance `);

                expect(balance).to.equal(oldBalance);
            }
        });
        it('check rest FS', function() {
            const { add, rest, actionNow } = data;
            const oldRest = globalDate.oldRest;

            if (actionNow == "freespin") {
                logger.info('check rest FS');
                let rightRest = null;
                if (add > 0) {
                    rightRest = oldRest - 1 + 17;
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
            let { rest, res, actionSpin, actionNow, wildInSpin, numberRSpin, positionWild, indexWild, winRSpin } = data;
            // let nextSpin = res.context.actions;
            let oldBalance = res.user.balance;
            wildDate = {...wildDate, oldBalance };
            await fs.writeFile('db2.json', JSON.stringify(wildDate));
            if (res.context.hasOwnProperty("freespins")) {
                if (rest > 0) {
                    let oldRest = res.context.freespins.count.rest;
                    let oldTotal = res.context.freespins.count.total;
                    let oldFsWin = res.context.freespins.win;
                    let oldBalance = res.user.balance;
                    globalDate = { oldRest, oldTotal, oldFsWin, oldBalance };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));
                } else if (rest === 0) {
                    let oldFsWin = 0;
                    globalDate = {...globalDate, oldFsWin };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));
                }
            }
            if ((wildInSpin)) {
                const oldPositionWild = positionWild;
                const oldIndexWild = indexWild;
                let oldWinRSpin = winRSpin;
                if (actionSpin === "spin") {
                    oldWinRSpin = 0;
                }
                wildDate = {...wildDate, numberRSpin, oldPositionWild, oldIndexWild, oldBalance, oldWinRSpin };
                await fs.writeFile('db2.json', JSON.stringify(wildDate));
            }
        });
    });
}