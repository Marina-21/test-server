const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs').promises;
require('dotenv').config();

const { winRight, betLines, checkWin1, readToken } = require('../../const/function');
const { freespin, spinbeforFS } = require('../../const/spinPlatform');
const { paytable50Lines } = require('../../const/Paytable');
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

let { urlSpin, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
let { id, lines, name, betUkr, betTR } = gamesDate[13];

let elbet = gamesDate[13][bet];
let token;
let cheat = "1CGFFC1DDDHHH1ECFFFFEEEGG";

let actionSpin = "spin";

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
            total: 0,
            add: 0,
            rest: 0,
            balance: 0,
            isWinScatter: false,
            winLinesScatter: null,
            winLinesWithoutScatter: null,
            allWinLines: null,
            fsWin: 0,
            actionSpin: null,
            arrScatter: null,
            funcResultWin: null,
            actionNow: null
        };
        before("Spin", async() => {
            if (i >= 15 && actionSpin == "spin") {
                try {
                    token = await readToken(nameToken);
                    const response = await spinbeforFS(urlSpin, token, id, elbet, lines, cheat);
                    let { res, actionSpin } = response;
                    console.log(res);

                    const obj = res.context.freespins.count;
                    let { rest, total } = obj;
                    const fsWin = res.context.freespins.win;
                    const balance = res.user.balance;
                    const funcResultWin = checkWin1(res);
                    const matrix = res.context.matrix;

                    data = {...data, ...obj, res, actionSpin, funcResultWin, matrix };

                    globalDate = {...globalDate, oldRest: rest, oldTotal: total, oldFsWin: fsWin, oldBalance: balance };
                    await fs.writeFile('db.json', JSON.stringify(globalDate));

                    if (funcResultWin !== null) {
                        let winLinesWithoutScatter = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);

                        if (funcResultWin.allWinLines[0].id == null) {
                            let isWinScatter = true;
                            let winLinesScatter = funcResultWin.allWinLines[0];
                            data = {...data, isWinScatter, winLinesScatter };
                        }
                        data = {...data, winLinesWithoutScatter, ...funcResultWin };
                    }

                } catch (error) {
                    console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            } else {
                try {
                    token = await readToken(nameToken);
                    const response = await freespin(urlSpin, token, id, elbet, lines);
                    let { res, actionSpin } = response;
                    console.log(res);
                    const obj = res.context.freespins.count;
                    let actionNow = res.context.current;
                    console.log(obj.rest);
                    const fsWin = res.context.freespins.win;
                    const matrix = res.context.matrix;
                    const balance = res.user.balance;

                    const funcResultWin = checkWin1(res);

                    data = {...data, ...obj, res, matrix, balance, fsWin, actionSpin, funcResultWin, actionNow };

                    if (funcResultWin !== null) {
                        let winLinesWithoutScatter = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);

                        if (funcResultWin.allWinLines[0].id == null) {
                            let isWinScatter = true;
                            let winLinesScatter = funcResultWin.allWinLines[0];
                            data = {...data, isWinScatter, winLinesScatter };
                        }
                        data = {...data, winLinesWithoutScatter, ...funcResultWin };
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
            let { actionSpin, matrix, add, total, actionNow } = data;
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
                    let oldTotal = total + 15;

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
            const { add, total, arrScatter, actionNow } = data;

            if (actionNow == "freespin") {
                const { oldTotal } = globalDate;
                if (arrScatter.length > 2) {
                    console.log(`${oldTotal+add} oldTotal FS +rest Fs ${total}- total FS`);
                    expect(oldTotal + add).to.equal(total);
                } else {
                    console.log(`${oldTotal} - oldTotal FS ${total}-total FS`);
                    expect(+oldTotal).to.equal(+total);
                }
            }
        });
        it('check rest FS', function() {
            const { add, rest, actionNow } = data;
            const { oldRest } = globalDate;

            if (actionNow == "freespin") {
                let rightRest = 0;
                if (add > 0) {
                    rightRest = oldRest - 1 + 15;
                } else {
                    rightRest = oldRest - 1;
                }
                console.log(`${rightRest}  - rightRest`);

                expect(rest).to.be.equal(+rightRest);
            }
        });
        it('balance is not change', function() {
            const { rest, balance, actionSpin, actionNow } = data;
            let { oldBalance } = globalDate;

            if (actionNow == "freespin") {
                if (rest > 0) {
                    console.log(`${balance} - balance/ ${oldBalance}- oldBalance`);
                    expect(balance).to.be.equal(oldBalance);
                }
            }
        });
        it('check correct wining symbol position in FS', function() {
            let { matrix, winLinesWithoutScatter, actionSpin, funcResultWin, actionNow } = data;

            if (actionSpin == "freespin" || actionNow == "freespin") {
                if (funcResultWin !== null) {

                    winLinesWithoutScatter.forEach((el) => {
                        console.log(el.id);
                        const winPositions = el.positions;
                        console.log(winPositions);
                        const winSymbol = el.symbol;

                        winPositions.forEach((el) => {
                            const tempSymbols = matrix[el[0]][el[1]];
                            if (tempSymbols !== "3") {
                                expect(winSymbol).to.be.equal(tempSymbols);
                            } else {
                                expect("3").to.be.equal(tempSymbols);
                                console.log('there is a wild in the pay line');
                            }
                        });
                        console.log([winSymbol] + " is correct position");
                    });
                }
            }
        });
        it('check correct wining symbol position Scatter in FS', function() {
            let { matrix, winLinesScatter, isWinScatter, actionSpin, actionNow } = data;

            if (actionSpin == "freespin" || actionNow == "freespin") {
                if (isWinScatter == true) {
                    console.log(`winLinesNull ` + winLinesScatter);
                    const positionSymbols = winLinesScatter.positions;
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
        it('check correct accrual of winnings in FS', () => {
            let { res, matrix, winLinesWithoutScatter, funcResultWin, actionNow } = data;

            if (actionNow == "freespin" && funcResultWin !== null) {
                let bet = res.context.bet;

                winLinesWithoutScatter.forEach((el) => {
                    const winPositions = el.positions;
                    console.log(matrix);
                    console.log(winPositions);
                    const winSymbol = el.symbol;
                    console.log(winSymbol);
                    const amount = el.amount;
                    const getingSymbols = [];
                    winPositions.forEach((el) => {
                        const tempSymbols = matrix[el[0]][el[1]];
                        getingSymbols.push(tempSymbols);
                    });
                    const arrWithWild = getingSymbols.filter((value) => value == 3);

                    let rightAmount = winRight(winPositions, paytable50Lines, winSymbol, bet);

                    if (arrWithWild.length > 0 && winSymbol !== "3") {
                        let fsWinRigt = (rightAmount * 2);
                        console.log(fsWinRigt);
                        console.log(amount);

                        expect(+amount).to.be.equal(fsWinRigt);

                    } else {
                        let fsWinRigt = (rightAmount);
                        console.log(fsWinRigt);
                        console.log(amount);

                        expect(+amount).to.be.equal(fsWinRigt);
                    }

                });
            }
        });
        it('check correct accrual Scatter in FS ', function() {
            let { res, winLinesScatter, isWinScatter, actionNow } = data;

            if (actionNow == "freespin" && isWinScatter == true) {
                const bet = betLines(res);
                const symbol = 1;
                const amount = winLinesScatter.amount;
                const winPositions = winLinesScatter.positions;
                console.log(winLinesScatter);

                let rightAmount = winRight(winPositions, paytable50Lines, symbol, bet);
                console.log(`scatter is accrualed correct ${amount} - amount/ ${rightAmount} - rightAmount`);

                expect(amount).to.be.equal(rightAmount);
            }
        });
        it('check correct accrual fsWin', function() {
            let { fsWin, allWinLines, actionSpin, funcResultWin, actionNow } = data;
            let { oldFsWin } = globalDate;

            if (actionNow == "freespin" && funcResultWin !== null) {

                let totalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                console.log(`${fsWin} - fsWin /${oldFsWin}+${totalAmount} - oldFsWin + totalAmount`);
                expect(fsWin).to.be.equal(oldFsWin + totalAmount);
            }
        });
        it('check correct add fsWin to balance', function() {
            let { add, rest, fsWin, balance, actionNow } = data;
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