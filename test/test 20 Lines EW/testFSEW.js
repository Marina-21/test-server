const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;


const { freespinEW } = require('../../const/SpinExpendingWild');
const { spinbeforFSEW } = require('../../const/SpinExpendingWild');
const { checkWin1 } = require('../../const/function');
const { PaytableCoef } = require('../../const/function');
const { paytable20LinesEW } = require('../../const/Paytable');
const { betLines } = require('../../const/function');
const { chekExpendingWild } = require('../../const/function');
const _ = require('lodash');

chai.use(chaiHttp);

let actionSpin = "spin"; //spin - FS
console.log(actionSpin);


for (let i = 15; i >= 0; i--) {
    describe.only('Test FSEW', () => {
        let globalDate = {
            oldBalance: 0,
            oldFsWin: 0,
            oldTotal: 0
        };

        let data = {
            res: null,
            matrix: null,
            total: 0,
            add: 0,
            rest: 0,
            balance: 0,
            isWinScater: false,
            winLinesScatter: null,
            winLinesWithoutNull: null,
            allWinLines: null,
            fsWin: 0,
            action: false,
            newMatrix: null,
            indexWild: null,
            featureEW: false,
            ExpWild: false,
            funcResultWin: null
        };

        before("Spin", async() => {
            if (i >= 15 && actionSpin == "spin") {
                try {
                    const responce = await spinbeforFSEW();
                    let { res } = responce;
                    console.log(res);
                    const obj = res.context.freespins.count;
                    console.log(obj.rest);

                    let action = false;
                    actionSpin = "freespin"; // next spin - FS
                    console.log(actionSpin);
                    const matrix = res.context.matrix;
                    let funcResultExpW = chekExpendingWild(matrix);
                    const funcResultWin = checkWin1(res);
                    const balance = res.user.balance;
                    data = {...data, ...obj, res, action, ...funcResultExpW, funcResultWin, balance };

                    if (funcResultWin !== null) {
                        let winLinesWithoutNull = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);
                        console.log(funcResultWin.allWinLines);
                        console.log(winLinesWithoutNull);

                        if (funcResultWin.allWinLines[0].id == null && funcResultWin.allWinLines[0].amount != 0) {
                            let isWinScatter = true;
                            let winLinesScatter = funcResultWin.allWinLines[0];
                            data = {...data, isWinScatter, winLinesScatter };
                        }
                        data = {...data, winLinesWithoutNull, ...funcResultWin };
                    }

                    if (res.context.hasOwnProperty("feature")) {
                        if (res.context.feature.hasOwnProperty("expendingWild")) {
                            let featureEW = true;
                            let obj = res.context.feature.expendingWild;
                            data = {...data, ...obj, featureEW };
                        }
                    }
                } catch (error) {

                    console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            } else {
                try {
                    const responce = await freespinEW();
                    let { actionSpin, res } = responce;
                    console.log(actionSpin);

                    const obj = res.context.freespins.count;
                    console.log(obj.rest);
                    const fsWin = res.context.freespins.win;
                    const matrix = res.context.matrix;
                    let funcResultExpW = chekExpendingWild(matrix);
                    const balance = res.user.balance;
                    const action = true;

                    const funcResultWin = checkWin1(res);

                    data = {...data, ...obj, res, matrix, balance, fsWin, action, funcResultWin, ...funcResultExpW };
                    if (funcResultWin !== null) {
                        let winLinesWithoutNull = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);
                        console.log(funcResultWin.allWinLines);

                        if (funcResultWin.allWinLines[0].id == null) {
                            let isWinScatter = true;
                            let winLinesScatter = funcResultWin.allWinLines[0];
                            data = {...data, isWinScatter, winLinesScatter };
                        }
                        data = {...data, winLinesWithoutNull, ...funcResultWin };
                    }
                    if (res.context.hasOwnProperty("feature")) {
                        if (res.context.feature.hasOwnProperty("expendingWild")) {
                            let featureEW = true;
                            let obj = res.context.feature.expendingWild;
                            data = {...data, ...obj, featureEW };
                        }
                    }

                    const file = await fs.readFile('db.json', 'utf8');
                    const fileData = JSON.parse(file);
                    globalDate = {...fileData };
                } catch (error) {
                    console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            }
        });
        it('check correct add count of FS', function() {
            let { action } = data;
            if (action == true) {
                let { matrix, add, total, oldTotal } = data;
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
            const { add, total, action } = data;
            if (action == true) {
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
            const { add, rest, action } = data;
            const oldRest = globalDate.oldRest;
            if (action == true) {
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
            const { rest, balance, action } = data;
            let { oldBalance } = globalDate;

            if (action == true && rest > 0) {
                console.log(balance + " balance" + oldBalance + " oldBalance");
                expect(balance).to.be.equal(oldBalance);
            }
        });
        it('check correct wining symbol position in FS', function() {
            let { newMatrix, winLinesWithoutNull, funcResultWin, action } = data;
            if (funcResultWin !== null) {
                winLinesWithoutNull.forEach((el) => {
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
                    console.log([winSymbol] + " is correct position");
                });
            }
        });
        it('check correct wining symbol position Scatter in FS', function() {
            let { newMatrix, winLinesScatter, isWinScatter, funcResultWin, action } = data;
            if (funcResultWin !== null && isWinScatter == true) {
                console.log(winLinesScatter);
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
        it('check correct accrual of winnings in FS(without * 3)', () => {
            let { res, winLinesWithoutNull, funcResultWin } = data;
            if (funcResultWin !== null) {
                let bet = res.context.bet;
                winLinesWithoutNull.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    const amount = el.amount;

                    function winRight() {
                        return PaytableCoef(winPositions, paytable20LinesEW, winSymbol) * bet;
                    }
                    let rightAmount = winRight();

                    expect(amount).to.be.equal(rightAmount);
                });
            }
        });
        it('check correct accrual Scatter in FS(without * 3)', function() {
            let { res, winLinesScatter, isWinScatter, funcResultWin } = data;
            if (funcResultWin !== null && isWinScatter == true) {
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
        it('check correct accrual fsWin', function() {
            let { fsWin, funcResultWin, allWinLines, action } = data;
            let { oldFsWin } = globalDate;
            if (action == true && funcResultWin !== null) {
                let totalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                expect(fsWin).to.be.equal(oldFsWin + totalAmount);
            } else {
                expect(fsWin).to.be.equal(oldFsWin);
            }
        });
        it('check correct add fsWin to balance', function() {
            let { action } = data;
            if (action == true) {
                const { add, rest, fsWin, balance } = data;
                let { oldBalance } = globalDate;
                if (rest == 0 && add == 0) {
                    const rightBalance = oldBalance + fsWin;
                    console.log("!!! balance " + balance);
                    console.log("!!! rightBalance " + rightBalance);
                    console.log("!!! fsWin " + fsWin);
                    expect(balance).to.equal(rightBalance);
                }
            }
        });
        it('check wild is expending', function() {
            let { newMatrix } = data;
            let arrWild = [];

            newMatrix.forEach((el, index) => {
                let tempSymbol = el.filter(symbol => symbol == 2);
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
        after("wright", async() => {
            let { rest, res } = data;
            if (rest > 0) {
                let oldRest = res.context.freespins.count.rest;
                let oldTotal = res.context.freespins.count.total;
                let oldFsWin = res.context.freespins.win;
                let oldBalance = res.user.balance;
                globalDate = {...globalDate, oldRest, oldTotal, oldFsWin, oldBalance };
                await fs.writeFile('db.json', JSON.stringify(globalDate));
            }
        });
    });
}