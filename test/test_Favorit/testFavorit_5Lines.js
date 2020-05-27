const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;

const { winRight } = require('../../const/function');
const { checkWin1 } = require('../../const/function');
const { checkSymbolMultiplier } = require('../../const/function');
const { paytable5Lines } = require('../../const/Paytable');
const { favorit } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { lines5 } = require('../../const/lines5');
const { checkTypeWin } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseFavorit.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

let { urlSpin, token, gamesDate, bets } = favorit;
let { id, lines, name } = gamesDate[8];
let elbet = bets[2];

for (let i = 0; i < 100; i++) {
    describe(`Test 5 Lines ${name} - ${i}`, () => {
        let data = {
            allWinLines: null,
            res: null,
            matrix: null,

            total: 0,
            balance: 0,
            funcResultWin: null,
            bet: 0,
            featureMult: false,
            value: 0,
            win: 0,
            totalAmount: 0,
            firstWinSymbol: null
        };

        before("Spin", async() => {
            try {
                const response = await spin(urlSpin, token, id, elbet, lines);
                let { res } = response;
                console.log(res);
                logger.info(`Test 10Lines: game ${name}: ${id}, -  ${i}`);
                logger.info(res);

                const funcResultWin = checkWin1(res);
                const matrix = res.context.matrix;
                let bet = res.context.bet;


                data = {...data, res, matrix, funcResultWin, bet };

                if (funcResultWin !== null) {
                    let { allWinLines } = funcResultWin;
                    let firstWinSymbol = String(allWinLines[0].symbol);
                    let totalAmount = res.context.win.total;

                    data = {...data, allWinLines, firstWinSymbol, totalAmount };
                }
                if (res.context.hasOwnProperty("feature")) {
                    if (res.context.feature.hasOwnProperty("multiplier")) {
                        let featureMult = true;
                        let obj = res.context.feature.multiplier;
                        data = {...data, ...obj, featureMult };
                    }
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('winning line consist of only 3 symbols', () => {
            let { funcResultWin, matrix, allWinLines } = data;

            if (funcResultWin !== null) {
                logger.info('winning line consist of only 3 symbols');
                allWinLines.forEach(el => {
                    let symbol = el.symbol;
                    console.log(el);
                    logger.info(`winLin - ${el}`);
                    let winPosition = el.positions;
                    let arrSymbols = [];
                    winPosition.forEach(el => {
                        let elCoordinate = matrix[el[0]][el[1]];
                        arrSymbols.push(elCoordinate);
                    });
                    let arrEl = arrSymbols.filter(value => value == symbol);
                    console.log(arrEl);
                    logger.info(`rightSymbolsLine - ${arrEl}`);
                    expect(arrEl.length).to.equal(3);
                });
            }
        });
        it('winAmount from response equal (bet x coef)', () => {
            let { funcResultWin, bet, allWinLines } = data;

            if (funcResultWin !== null) {
                allWinLines.forEach(el => {
                    logger.info('winAmount from response equal (bet x coef)');
                    let winPositions = el.positions;
                    let winSymbol = el.symbol;
                    let amount = el.amount;
                    let rightAmount = winRight(winPositions, paytable5Lines, winSymbol, bet);
                    console.log(` ${ amount } - amount `);
                    logger.info(` ${ amount } - amount `);
                    console.log(` ${ rightAmount } - rightAmount `);
                    logger.info(` ${ rightAmount } - rightAmount `);

                    expect(amount).to.be.equal(rightAmount);
                });
            }
        });
        it("check correct winning symbol position", () => {
            let { funcResultWin, allWinLines, matrix } = data;

            if (funcResultWin !== null) {
                logger.info('check correct wining symbol position');
                allWinLines.forEach(el => {
                    let winSymbol = el.symbol;
                    let winPosition = el.positions;

                    winPosition.forEach(el => {
                        let rightSymbol = matrix[el[0]][el[1]];
                        console.log(rightSymbol);
                        logger.info(`${rightSymbol} -rightSymbol`);

                        expect(winSymbol).to.be.equal(rightSymbol);
                        console.log([winSymbol] + " is correct position");
                        logger.info([winSymbol] + " is correct position");
                    });
                });
            }
        });
        it('Winning Line coordinates from response is correct', async() => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                logger.info('Winning Line coordinates from response is correct');
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;
                    const coordinatesLines = lines5[idLines];
                    console.log(coordinatesLines);
                    logger.info(`rightCoordinatesLines - ${coordinatesLines}`);
                    const value = _.isEqual(winPosition, coordinatesLines);
                    expect(value).to.be.true;
                });
            }
        });
        it("check correct id of wining line from response", () => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                logger.info("check correct id of wining line from response");
                let arrlines5 = Object.values(lines5);
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;

                    arrlines5.forEach((line, index) => {
                        const result = _.isEqual(winPosition, line);
                        if (result) {
                            console.log(`(${+index} + 1) - rihght id`);
                            logger.info(`(${+index} + 1) - rihght id`);
                            console.log(`${idLines} - in response`);
                            logger.info(`${idLines} - in response`);


                            expect(+idLines).to.be.equal((+[index]) + 1);
                        }
                    });
                });
            }
        });
        it("Check x 2", () => {
            let { funcResultWin, allWinLines, bet, firstWinSymbol, featureMult, totalAmount } = data;

            if (funcResultWin !== null && featureMult) {
                logger.info("Check x 2");
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);

                let symbolMultiplier = checkSymbolMultiplier(firstWinSymbol);

                if (symbolMultiplier) {
                    let rihgtAmount = rightAmountLines * 5 * 2;
                    console.log(`rihgtAmount - ${rihgtAmount}`);
                    console.log(`totalAmount - ${totalAmount}`);
                    logger.info(`rihgtAmount - ${rihgtAmount}`);
                    logger.info(`totalAmount - ${totalAmount}`);
                    expect(+totalAmount).to.be.equal(rihgtAmount);
                } else {
                    let rihgtAmount = rightAmountLines * 5;
                    console.log(`rihgtAmount - ${rihgtAmount}`);
                    console.log(`totalAmount - ${totalAmount}`);
                    logger.info(`rihgtAmount - ${rihgtAmount}`);
                    logger.info(`totalAmount - ${totalAmount}`);
                    expect(+totalAmount).to.be.equal(rihgtAmount);
                }
            }
        });
        it("check total amount is correct", () => {
            let { funcResultWin, allWinLines, featureMult, totalAmount } = data;

            if (funcResultWin !== null) {
                logger.info('check total amount is correct');
                let rightAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                if (featureMult) {
                    let rightAmountMult = +rightAmount * 2;
                    console.log(`rightAmountMult - ${rightAmountMult}`);
                    logger.info(`rightAmountMult - ${rightAmountMult}`);
                    expect(+totalAmount).to.be.equal(rightAmountMult);
                } else {
                    console.log(`rightAmount - ${rightAmount}`);
                    logger.info(`rightAmount - ${rightAmount}`);
                    expect(+totalAmount).to.be.equal(+rightAmount);
                }
            }
        });
        it('check response has "feature" if there is "x 2"', () => {
            let { funcResultWin, allWinLines, featureMult, firstWinSymbol } = data;

            if (funcResultWin !== null && allWinLines.length == 5) {
                logger.info('check response has "feature" if there is "x 2"');
                let symbolMultiplier = checkSymbolMultiplier(firstWinSymbol);

                if (symbolMultiplier) {
                    console.log(`${featureMult} - featureMult true`);
                    logger.info(`${featureMult} - featureMult true`);

                    expect(featureMult).to.be.equal(true);
                }
            }
        });
        it('check response has "x 2" if there is "feature', () => {
            let { funcResultWin, allWinLines, featureMult, bet, totalAmount, firstWinSymbol } = data;

            if (funcResultWin !== null && featureMult == true) {
                logger.info('check response has "x 2" if there is "feature');
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);
                let rightAmountMult = rightAmountLines * 5 * 2;

                console.log(`${totalAmount} x2 - there is "feature`);
                logger.info(`${totalAmount} x2 - there is "feature`);

                expect(+rightAmountMult).to.be.equal(+totalAmount);
            }
        });
        it("multiplier win is correct", () => {
            let { funcResultWin, allWinLines, featureMult, bet, win, firstWinSymbol } = data;

            if (funcResultWin !== null && featureMult == true) {
                logger.info("multiplier win is correct");
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);
                let rightAmountMult = rightAmountLines * 5 * 2;
                console.log(`rightAmountMult - ${rightAmountMult}`);
                console.log(`${win} - win`);
                logger.info(`rightAmountMult - ${rightAmountMult}`);
                logger.info(`$ { win } - win `);

                expect(+rightAmountMult).to.be.equal(+win);
            }
        });
        it("check type of win 5 Lines", () => {
            let { funcResultWin, res } = data;

            if (funcResultWin !== null) {
                logger.info("check type of win 5 Lines");
                const gameTypeWin = res.context.win.type;

                let rightTypeWin = checkTypeWin(res);

                logger.info(`${rightTypeWin} - rightTypeWin`);

                expect(gameTypeWin).to.eql(rightTypeWin);
                logger.info("Type of win is correct");
            }
        });
    });
}