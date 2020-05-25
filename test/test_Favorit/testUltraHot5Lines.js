const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;

const { winRight } = require('../../const/function');
const { checkWin1 } = require('../../const/function');
const { checkSymbolMultiplier } = require('../../const/function');
const { PaytableCoef } = require('../../const/function');
const { paytable5Lines } = require('../../const/Paytable');
const { betLines } = require('../../const/function');
const { Dev } = require('../../const/platforms');
const { favorit } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { lines5 } = require('../../const/lines5');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[8];
let elbet = bets[2];

for (let i = 0; i < 10; i++) {
    describe.skip('Test 5Lines ', () => {
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
            }
        });
        it('winning line consist of only 3 symbols', () => {
            let { funcResultWin, matrix, allWinLines } = data;

            if (funcResultWin !== null) {
                allWinLines.forEach(el => {
                    let symbol = el.symbol;
                    console.log(el);
                    let winPosition = el.positions;
                    let arrSymbols = [];
                    winPosition.forEach(el => {
                        let elCoordinate = matrix[el[0]][el[1]];
                        arrSymbols.push(elCoordinate);
                    });
                    let arrEl = arrSymbols.filter(value => value == symbol);
                    console.log(arrEl);
                    expect(arrEl.length).to.equal(3);
                });
            }
        });
        it('winAmount from response equal (bet x coef)', () => {
            let { funcResultWin, bet, allWinLines } = data;

            if (funcResultWin !== null) {
                allWinLines.forEach(el => {
                    let winPositions = el.positions;
                    let winSymbol = el.symbol;
                    let amount = el.amount;
                    let rightAmount = winRight(winPositions, paytable5Lines, winSymbol, bet);
                    console.log(amount);
                    console.log(rightAmount);

                    expect(amount).to.be.equal(rightAmount);
                });
            }
        });
        it("check correct winning symbol position", () => {
            let { funcResultWin, allWinLines, matrix } = data;

            if (funcResultWin !== null) {
                allWinLines.forEach(el => {
                    let winSymbol = el.symbol;
                    let winPosition = el.positions;

                    winPosition.forEach(el => {
                        let rightSymbol = matrix[el[0]][el[1]];
                        console.log(rightSymbol);

                        expect(winSymbol).to.be.equal(rightSymbol);
                    });
                });
            }
        });
        it('Winning Line coordinates from response is correct', async() => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;
                    const coordinatesLines = lines5[idLines];
                    console.log(coordinatesLines);
                    const value = _.isEqual(winPosition, coordinatesLines);
                    expect(value).to.be.true;
                });
            }
        });
        it("check correct id of wining line from response", () => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                let arrlines5 = Object.values(lines5);
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;

                    arrlines5.forEach((line, index) => {
                        const result = _.isEqual(winPosition, line);
                        if (result) {
                            console.log((+[index]) + 1);
                            console.log(idLines);


                            expect(+idLines).to.be.equal((+[index]) + 1);
                        }
                    });
                });
            }
        });
        it("Check x 2", () => {
            let { funcResultWin, allWinLines, bet, firstWinSymbol, featureMult, totalAmount } = data;

            if (funcResultWin !== null && featureMult) {
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);

                let symbolMultiplier = checkSymbolMultiplier(firstWinSymbol);

                if (symbolMultiplier) {
                    let rihgtAmount = rightAmountLines * 5 * 2;
                    console.log(rihgtAmount);
                    console.log(totalAmount);
                    expect(+totalAmount).to.be.equal(rihgtAmount);
                } else {
                    let rihgtAmount = rightAmountLines * 5;
                    console.log(rihgtAmount);
                    console.log(totalAmount);
                    expect(+totalAmount).to.be.equal(rihgtAmount);
                }
            }
        });
        it("check total amount is correct", () => {
            let { funcResultWin, allWinLines, res, featureMult, totalAmount } = data;

            if (funcResultWin !== null) {
                let rightAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                if (featureMult) {
                    let rightAmountMult = +rightAmount * 2;
                    console.log(rightAmountMult);
                    expect(+totalAmount).to.be.equal(rightAmountMult);
                } else {
                    console.log(rightAmount);
                    expect(+totalAmount).to.be.equal(+rightAmount);
                }
            }
        });
        it('check response has "feature" if there is "x 2"', () => {
            let { funcResultWin, allWinLines, featureMult, firstWinSymbol } = data;

            if (funcResultWin !== null && allWinLines.length == 5) {
                let symbolMultiplier = checkSymbolMultiplier(firstWinSymbol);

                if (symbolMultiplier) {
                    console.log(`${featureMult} - featureMult true`);

                    expect(featureMult).to.be.equal(true);
                }
            }
        });
        it('check response has "x 2" if there is "feature', () => {
            let { funcResultWin, allWinLines, featureMult, bet, totalAmount, firstWinSymbol } = data;

            if (funcResultWin !== null && featureMult == true) {
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);
                let rightAmountMult = rightAmountLines * 5 * 2;

                expect(+rightAmountMult).to.be.equal(+totalAmount);
                console.log(`${totalAmount} x2 - there is "feature`);
            }
        });
        it("multiplier win is correct", () => {
            let { funcResultWin, allWinLines, featureMult, bet, win, firstWinSymbol } = data;

            if (funcResultWin !== null && featureMult == true) {
                let winPositions = allWinLines[0].positions;

                let rightAmountLines = winRight(winPositions, paytable5Lines, firstWinSymbol, bet);
                let rightAmountMult = rightAmountLines * 5 * 2;
                console.log(rightAmountMult);
                console.log(`${win} - win`);
                expect(+rightAmountMult).to.be.equal(+win);
            }
        });
    });
}