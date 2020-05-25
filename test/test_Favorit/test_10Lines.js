const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;

const { winRight } = require('../../const/function');
const { checkWin1 } = require('../../const/function');
const { paytable } = require('../../const/Paytable');
const { betLines } = require('../../const/function');
const { Dev } = require('../../const/platforms');
const { favorit } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { lines10 } = require('../../const/lines10');


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[0];
let elbet = bets[2];

for (let i = 0; i < 100; i++) {
    describe.skip('Test 10Lines ', () => {

        let globalDate = {
            oldBalance: 0,
            oldFsWin: 0,
            oldTotal: 0
        };
        let data = {
            isWinScater: false,
            allWinLines: null,
            actionSpin: null,
            res: null,
            matrix: null,
            total: 0,
            add: 0,
            rest: 0,
            balance: 0,
            fsWin: 0,
            isWinScatter: false,
            arrScatter: null,
            actionNow: null,
            winLinesScatter: null,
            winLinesWithoutScatter: null,
            funcResultWin: null
        };

        before("Spin", async() => {
            try {
                const response = await spin(urlSpin, token, id, elbet, lines);
                let { actionSpin, res } = response;
                console.log(res);

                console.log(`actionSpin  ${actionSpin}`);

                const funcResultWin = checkWin1(res);
                const matrix = res.context.matrix;
                let actionNow = res.context.current;

                data = { res, actionSpin, matrix, actionNow, funcResultWin };

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
        it('Winning Line coordinates from response is correct', () => {
            let { funcResultWin, winLinesWithoutScatter } = data;

            if (funcResultWin != null) {

                winLinesWithoutScatter.forEach((el) => {

                    const winPositions = el.positions;
                    console.log(winPositions);
                    const idLines = el.id;
                    const numberLines = lines10[idLines];
                    const tempArr = numberLines.slice(0, winPositions.length);
                    const value = _.isEqual(winPositions, tempArr);
                    console.log(tempArr);
                    expect(tempArr.length).to.be.equal(winPositions.length);
                    expect(value).to.be.true;
                });
            }
        });
        it("check correct id of wining line from response", () => {
            let { funcResultWin, allWinLines } = data;

            if (funcResultWin !== null) {
                let arrlines10 = Object.values(lines10);
                allWinLines.forEach(el => {
                    let winPosition = el.positions;
                    const idLines = el.id;

                    arrlines10.forEach((line, index) => {
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
        it('check correct accrual Scatter', () => {
            let { res, winLinesScatter, isWinScatter, actionNow } = data;

            if (isWinScatter == true && actionNow == "spin") {

                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);
                const winRightNull = winRight(winPositions, paytable, symbol, bet);

                console.log(`${amount} - amount`);
                console.log(`${winRightNull} - winRightNull`);

                expect(amount).to.be.equal(winRightNull);
            }
        });

        it('check correct position Scatter', () => {
            let { winLinesScatter, isWinScatter, matrix } = data;

            if (isWinScatter == true) {

                const positionSymbols = winLinesScatter.positions;
                console.log(positionSymbols);
                const symbol = 1;

                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                    console.log(tempSymbols);

                    expect(symbol).to.be.equal(Number(tempSymbols));
                });

                console.log("position of wining Scatter is corect");
            }
        });
        it('check correct wining symbol position', () => {
            let { funcResultWin, winLinesWithoutScatter, matrix } = data;

            if (funcResultWin != null) {

                console.log(`${winLinesWithoutScatter.length} - winLines.length`);

                winLinesWithoutScatter.forEach((el) => {
                    console.log(`${el.id} - id`);
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
        });

        it('check correct accrual of winnings', () => {
            let { funcResultWin, winLinesWithoutScatter, actionNow, matrix, res } = data;

            if (funcResultWin != null && actionNow == "spin") {
                let bet = res.context.bet;

                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    const amount = el.amount;
                    console.log(amount);
                    const getingSymbols = [];
                    winPositions.forEach((el) => {
                        const tempSymbols = matrix[el[0]][el[1]];
                        getingSymbols.push(tempSymbols);
                    });
                    const arrWithWild = getingSymbols.filter((value) => value === "2");

                    let rightAmount = winRight(winPositions, paytable, winSymbol, bet);

                    if (arrWithWild.length > 0 && winSymbol !== "2") {
                        expect(amount).to.be.equal((rightAmount * 2));
                        console.log(rightAmount * 2);
                    } else {
                        expect(amount).to.be.equal(+rightAmount);
                        console.log(rightAmount);
                    }

                });
            }
        });
        it('check correct add count of FS', () => {
            let { actionNow, matrix, add, actionSpin } = data;
            if (actionNow == "freespin") {

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
                data = {...data, arrScatter };

                if (arrScatter.length > 2) {
                    console.log(add + " add ");
                    expect(add).to.be.equal(15);
                } else {
                    console.log(add + " add");
                    expect(add).to.equal(+0);
                }
            }
        });
        it('check correct total FS', () => {
            const { add, total, actionNow, arrScatter, actionSpin } = data;
            if (actionNow == "freespin") {

                const { oldTotal } = globalDate;

                if (arrScatter.length > 2) {
                    console.log(`${oldTotal+add} oldTotal FS +rest Fs ${total}- total FS`);
                    expect(oldTotal + add).to.equal(total);
                } else {
                    console.log(`${oldTotal} - oldTotal FS ${total}-total FS`);
                    expect(oldTotal).to.equal(total);
                }
            }
        });
        it('check rest FS', () => {
            const { add, rest, actionNow } = data;
            const { oldRest } = globalDate;

            if (actionNow == "freespin") {
                let rightRest = null;
                if (add > 0) {
                    rightRest = oldRest - 1 + 15;
                } else {
                    rightRest = oldRest - 1;
                }
                console.log(`${rightRest}  - rightRest`);

                expect(rest).to.be.equal(rightRest);
            }
        });
        it('balance is not change', () => {
            const { rest, balance, actionNow } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {
                if (rest > 0) {
                    console.log(`${balance} - balance/ ${oldBalance}- oldBalance`);
                    expect(balance).to.be.equal(oldBalance);
                }
            }
        });
        it('check correct accrual of winnings in FS * 3', () => {
            let { res, matrix, winLinesWithoutScatter, funcResultWin, actionNow } = data;

            if (actionNow == "freespin" && funcResultWin !== null) {

                let bet = res.context.bet;

                winLinesWithoutScatter.forEach((el) => {
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

                    let rightAmount = winRight(winPositions, paytable, winSymbol, bet);

                    if (arrWithWild.length > 0 && winSymbol !== "2") {
                        let fsWinRigt = (rightAmount * 2 * 3);
                        console.log(fsWinRigt);
                        console.log(amount);

                        expect(amount).to.be.equal(fsWinRigt);

                    } else {
                        let fsWinRigt = (rightAmount * 3);
                        console.log(fsWinRigt);
                        console.log(amount);

                        expect(amount).to.be.equal(fsWinRigt);
                    }
                });
            }
        });
        it('check correct accrual Scatter in FS * 3', function() {
            let { res, winLinesScatter, actionNow, isWinScatter } = data;
            if (actionNow == 'freespin' && isWinScatter == true) {

                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);

                let rightAmount = winRight(winPositions, paytable, symbol, bet) * 3;
                console.log(`scatter is accrualed correct ${amount} - amount/ ${rightAmount} - rightAmount`);

                expect(amount).to.be.equal(rightAmount);
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionNow, funcResultWin } = data;
            let { oldFsWin } = globalDate;

            if (actionNow == "freespin" && funcResultWin !== null) {

                let totalAmount = allWinLines.reduce((total, elLines) => total + elLines.amount, 0);

                console.log(`${fsWin} - fsWin /${oldFsWin}+${totalAmount} - oldFsWin + totalAmount`);
                expect(fsWin).to.be.equal(oldFsWin + totalAmount);
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

            if (actionSpin == "freespin" && rest > 0) {
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