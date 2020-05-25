const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;


const { chekExpendingWild } = require('../../const/function');
const { checkWin1 } = require('../../const/function');
const { PaytableCoef } = require('../../const/function');
const { paytable20LinesEW } = require('../../const/Paytable');
const { lines20 } = require('../../const/lines20');
const { betLines } = require('../../const/function');
const { Dev } = require('../../const/platforms');
const { favorit } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { init } = require('../../const/spinPlatform');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[11];
let elbet = bets[2];



for (let i = 0; i < 100; i++) {
    describe.skip('Test EW', function() {
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
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { actionSpin, res } = responce;
                console.log(res);
                console.log(`actionSpin  ${actionSpin}`);

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

            newMatrix.forEach((el, index) => {
                let tempSymbol = el.filter(symbol => symbol == wild);
                if (tempSymbol.length == 3) {
                    console.log("matrix has expending wild " + (index + 1));
                } else {
                    arrWild.push(...tempSymbol);
                }
            });
            expect(arrWild.length).to.equal(0);
        });
        it('check the wild is not appeared in 1 and 5 reels', () => {
            let { ExpWild, indexWild } = data;
            if (ExpWild == true) {
                let fistReels = indexWild.includes(0);
                let lastReels = indexWild.includes(4);
                expect(fistReels).to.be.equal(false);
                expect(lastReels).to.be.equal(false);
            }
        });
        it('check response has "expending Wild" if there is "feature', function() {
            let { featureEW, ExpWild } = data;
            if (featureEW == true) {
                expect(ExpWild).to.be.equal(true);
            }
        });
        it('check response has "feature" if there is "expending Wild"', () => {
            let { featureEW, ExpWild } = data;
            if (ExpWild == true) {
                expect(featureEW).to.be.equal(true);
            }
        });
        it('check response hasn`t scatter in reels "expending Wild"', () => {
            let { ExpWild, matrix, indexWild } = data;
            if (ExpWild == true) {
                let arrScatter = [];
                indexWild.forEach((el) => {
                    matrix.id = matrix[el];
                    let tempSymbol = matrix.id.filter(symbol => symbol == 1);
                    arrScatter.push(...tempSymbol);
                });
                expect(arrScatter.length).to.equal(0);
            }
        });
        it('check correct position of expending Wild', () => {
            let { featureEW, matrix, positions, wild } = data;
            if (featureEW == true) {

                let wildPositions = [];

                matrix.forEach((el, index) => {
                    let getingposition = el.indexOf("2");
                    if (getingposition >= 0) {
                        wildPositions.push([index, getingposition]);

                    }
                });
                const value = _.isEqual(wildPositions, positions);
                console.log('wildPositions ' + [wildPositions] + '  positions feature ' + [positions]);
                expect(value).to.be.true;

            }
        });
        it('check correct accrual of winnings', () => {
            let { res, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                let bet = res.context.bet;
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    console.log(winPositions);
                    console.log(winSymbol + " winSymbol");
                    const amount = el.amount;

                    function winRight() {
                        return PaytableCoef(winPositions, paytable20LinesEW, winSymbol) * bet;
                    }
                    let rightAmount = winRight();

                    expect(amount).to.be.equal(rightAmount);
                    console.log(amount + " amount " + rightAmount + " rightAmount");
                });
            }
        });
        it('check correct accrual Scatter', function() {
            let { res, winLinesScatter, isWinScatter, allWinLines, } = data;
            if (allWinLines !== null && isWinScatter == true) {
                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);
                const winRightNull = PaytableCoef(winPositions, paytable20LinesEW, symbol) * bet;

                expect(amount).to.be.equal(winRightNull);
                console.log("scatter is accrualed correct" + amount + " amount" + winRightNull + "winRightNull");
            }
        });
        it('check correct wining symbol position', function() {
            let { newMatrix, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;

                    winPositions.forEach((el) => {
                        const tempSymbols = newMatrix[el[0]][el[1]];
                        if (tempSymbols !== "2") {
                            expect(winSymbol).to.be.equal(tempSymbols);
                        } else {
                            expect("2").to.be.equal(tempSymbols);
                        }
                    });
                });
            }
        });
        it('check correct wining symbol position Scatter', function() {
            let { newMatrix, winLinesScatter, isWinScatter, allWinLines, } = data;
            if (allWinLines !== null && isWinScatter == true) {
                console.log(allWinLines);

                const positionSymbols = winLinesScatter.positions;
                const symbol = 1;
                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = newMatrix[coordinate[0]][coordinate[1]];
                    expect(symbol).to.be.equal(Number(tempSymbols));
                });
                console.log("position of wining Scatter is corect");
            }
        });
        it('Winning Line coordinates from response is correct', async() => {
            let { newmatrix, winLinesWithoutScatter, allWinLines } = data;
            if (allWinLines !== null) {
                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const idLines = el.id;
                    const numberLines = lines20[idLines];
                    const tempArr = numberLines.slice(0, winPositions.length);
                    const value = _.isEqual(winPositions, tempArr);
                    expect(tempArr.length).to.be.equal(winPositions.length);
                    expect(value).to.be.true;
                });
            }
        });
        it("check correct id of wining line from response", () => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                let arrlines20 = Object.values(lines20);
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;
                    let rightId = null;
                    arrlines20.forEach((line, index) => {
                        const tempArr = line.slice(0, winPosition.length);
                        const result = _.isEqual(winPosition, tempArr);
                        if (result) {
                            console.log((+[index]) + 1);
                            console.log(idLines);


                            expect(+idLines).to.be.equal((+[index]) + 1);
                        }
                    });
                });
            }
        });
        it('check total amount is correct', () => {
            let { allWinLines, res } = data;
            if (allWinLines !== null) {
                let rightTotalAvount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                expect(rightTotalAvount).to.be.equal(res.context.win.total);
            }
        });
        it('check correct add count of FS', function() {
            let { matrix, add, total, oldTotal, actionNow } = data;
            if (actionNow == "freespin") {

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
                    expect(add).to.be.equal(15);
                } else {
                    console.log(add + " add");
                    expect(add).to.equal(+0);
                }
            }
        });
        it('check correct total FS', function() {
            const { add, total, actionNow } = data;
            if (actionNow == "freespin") {
                const { oldTotal } = globalDate;
                if (add == 15) {
                    console.log(oldTotal + add + " oldTotal FS + rest Fs  " + total + " total FS");
                    expect(oldTotal + add).to.equal(total);
                } else {
                    console.log(oldTotal + " oldTotal FS  " + total + " total FS");
                    expect(+oldTotal).to.equal(+total);
                }
            }
        });
        it('check rest FS', function() {
            const { add, rest, actionNow } = data;
            const oldRest = globalDate.oldRest;

            if (actionNow == "freespin") {
                let rightRest = null;
                if (add > 0) {
                    rightRest = oldRest - 1 + 15;
                } else {
                    rightRest = oldRest - 1;
                }
                expect(rest).to.be.equal(rightRest);
            }
        });
        it('balance is not change', function() {
            const { rest, balance, actionNow } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {
                if (rest > 0) {
                    console.log(balance + " balance" + oldBalance + " oldBalance");
                    expect(balance).to.be.equal(oldBalance);
                }
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionNow } = data;
            let { oldFsWin } = globalDate;

            if (actionNow == "freespin") {
                if (allWinLines !== null) {

                    let totalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                    expect(fsWin).to.be.equal(oldFsWin + totalAmount);
                } else {
                    expect(fsWin).to.be.equal(oldFsWin);
                }
            }
        });
        it('check correct add fsWin to balance', function() {
            let { actionNow, add, rest, fsWin, balance } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {

                if (rest == 0 && add == 0) {
                    const rightBalance = oldBalance + fsWin;
                    console.log("!!! balance " + balance);
                    console.log("!!! rightBalance " + rightBalance);
                    console.log("!!! fsWin " + fsWin);
                    expect(balance).to.equal(rightBalance);
                }
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