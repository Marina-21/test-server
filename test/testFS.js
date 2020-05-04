const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;


const { freespin } = require('../const/spin');
const { spinbeforFS } = require('../const/spin');
const { checkWin1 } = require('../const/function');
const { PaytableCoef } = require('../const/function');
const { paytable } = require('../const/Paytable');
const { betLines } = require('../const/function');
const { chekActionSpin } = require('../const/function');

chai.use(chaiHttp);

let nameAction = "spin";

for (let i = 15; i >= 0; i--) {
    describe.skip('Test FS', () => {
        let globalDate = {
            oldBalance: 0,
            oldFsWin: 0,
            oldTotal: 0
        };

        let data = {
            res: null,
            matrix: null,
            oldTotal: 15,
            total: 0,
            add: 0,
            rest: 0,
            balance: 0,
            isWinNull: false,
            winLinesNull: null,
            winLinesWithoutNull: null,
            allWinLines: null,
            fsWin: 0,
            action: false
        };

        before("Spin", async() => {
            if (i >= 15 && nameAction == "spin") {
                try {
                    const res = await spinbeforFS();
                    const obj = res.context.freespins.count;
                    let action = false;
                    nameAction = "freespin";
                    data = {...data, ...obj, res, action };
                } catch (error) {
                    let { code, message } = data.res.status;
                    console.log(code + "  code");
                    console.log(message + "  message");
                    console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            } else {
                try {
                    const res = await freespin();

                    expect(res.status.status).to.be.equal(200);

                    const obj = res.context.freespins.count;
                    console.log(obj.rest);
                    const fsWin = res.context.freespins.win;
                    const matrix = res.context.matrix;
                    const balance = res.user.balance;
                    const action = true;
                    nameAction = chekActionSpin(res);
                    const funcResult = checkWin1(res);

                    data = {...data, ...obj, res, matrix, balance, fsWin, action, funcResult };
                    if (funcResult !== null) {
                        let winLinesWithoutNull = funcResult.allWinLines.filter(winLines => winLines.id !== null);

                        if (funcResult.allWinLines[0].id == null) {
                            let isWinNull = true;
                            let winLinesNull = funcResult.allWinLines[0];
                            data = {...data, isWinNull, winLinesNull };
                        }
                        data = {...data, winLinesWithoutNull, ...funcResult };
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
                //     let matrixTEst = [
                //         ["1", "B", "A"],
                //         ["1", "B", "A"],
                //         ["A", "1", "A"],
                //         ["A", "B", "A"],
                //     ["A", "B", "A"],
                // ];

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
            const { rest, add, total, action } = data;
            if (action == true) {
                const { oldTotal } = globalDate;
                if (add == 15 && rest != 15) {
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

            if (action) {
                if (rest > 0) {
                    console.log(balance + " balance" + oldBalance + " oldBalance");
                    expect(balance).to.be.equal(oldBalance);
                }
            }
        });
        it('check correct wining symbol position in FS', function() {
            let { matrix, winLinesWithoutNull, funcResult, action } = data;
            if (action == true) {
                if (funcResult !== null) {
                    console.log(winLinesWithoutNull.id + " winLinesWithoutNull.id");
                    winLinesWithoutNull.forEach((el) => {
                        console.log(el.id);
                        const winPositions = el.positions;
                        console.log(winPositions);
                        const winSymbol = el.symbol;

                        winPositions.forEach((el) => {
                            const tempSymbols = matrix[el[0]][el[1]];
                            if (tempSymbols !== "2") {
                                expect(winSymbol).to.be.equal(tempSymbols);
                            } else {
                                expect("2").to.be.equal(tempSymbols);
                                console.log('there is a wild in the pay line');
                            }
                        });
                        console.log([winSymbol] + " is correct position");
                    });
                }
            }
        });
        it('check correct wining symbol position null in FS', function() {
            let { matrix, winLinesNull, isWinNull, funcResult, action } = data;
            if (action == true) {
                if (funcResult !== null && isWinNull == true) {
                    console.log(`winLinesNull ` + winLinesNull);
                    const positionSymbols = winLinesNull.positions;
                    const symbol = 1;
                    positionSymbols.forEach((el) => {
                        const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                        const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                        expect(symbol).to.be.equal(Number(tempSymbols));
                    });

                    console.log("position of wining Scatter is corect");
                }
            }
        });
        it('check correct accrual of winnings in FS * 3', () => {
            let { res, matrix, winLinesWithoutNull, funcResult, action } = data;
            if (action == true && funcResult !== null) {
                console.log(matrix);
                let bet = betLines(res);
                winLinesWithoutNull.forEach((el) => {
                    const winPositions = el.positions;
                    console.log(winPositions);
                    const winSymbol = el.symbol;
                    console.log(winSymbol);
                    const amount = el.amount;
                    const getingSymbols = [];
                    winPositions.forEach((el) => {
                        const tempSymbols = matrix[el[0]][el[1]];
                        getingSymbols.push(tempSymbols);
                    });
                    const arrWithWild = getingSymbols.filter((value) => value == 2);

                    function winRight() {
                        return PaytableCoef(winPositions, paytable, winSymbol) * bet;
                    }

                    if (arrWithWild.length > 0 && winSymbol !== "2") {
                        let fsWinRigt = (winRight() * 2 * 3);
                        expect(amount).to.be.equal(fsWinRigt);
                        console.log(fsWinRigt);
                        console.log(amount);

                    } else {
                        let fsWinRigt = (winRight() * 3);
                        expect(amount).to.be.equal(fsWinRigt);
                        console.log(fsWinRigt);
                        console.log(amount);
                    }
                });
            }
        });
        it('check correct accrual Scatter in FS * 3', function() {
            let { res, winLinesNull, isWinNull, funcResult, action } = data;
            if (action == true) {
                if (funcResult !== null && isWinNull == true) {

                    const bet = res.context.bet;
                    const symbol = 1;
                    const amount = winLinesNull.amount;
                    const winPositions = winLinesNull.positions;
                    console.log(winLinesNull);
                    const winRightNull = PaytableCoef(winPositions, paytable, symbol) * bet * 3;

                    expect(amount).to.be.equal(winRightNull);
                    console.log("scatter is accrualed correct" + amount + " amount" + winRightNull + "winRightNull");
                }
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, funcResult, allWinLines, action } = data;
            let { oldFsWin } = globalDate;
            if (action == true) {
                if (funcResult !== null) {

                    let sum = 0;
                    allWinLines.forEach((el) => {
                        let amount = el.amount;
                        return sum += amount;
                    });
                    console.log(fsWin + " fsWin" + oldFsWin + " " + sum + " oldFsWin + sum");
                    expect(fsWin).to.be.equal(oldFsWin + sum);
                }
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
        after("wright", async() => {
            let { rest, res } = data;
            if (rest > 0) {
                let oldRest = res.context.freespins.count.rest;
                let oldTotal = res.context.freespins.count.total;
                let oldFsWin = res.context.freespins.win;
                let oldBalance = res.user.balance;
                globalDate = {...globalDate, oldRest, oldTotal, oldFsWin, oldBalance };
                await fs.writeFile('db.json', JSON.stringify(globalDate));
                // } else {
                //     let oldRest = "15";
                //     let oldTotal = "15";
                //     let oldFsWin = res.context.freespins.win;

                //     let oldBalance = res.user.balance;
                //     globalDate = { oldRest, oldTotal, oldFsWin, oldBalance };
                //     await fs.writeFile('db.json', JSON.stringify(globalDate));
            }
        });
    });
}