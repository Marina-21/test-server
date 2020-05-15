const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');



// const { freespin } = require('../const/spin');
const { spinEW } = require('../../const/SpinExpendingWild');
const { checkWin1 } = require('../../const/function');
const { PaytableCoef } = require('../../const/function');
const { paytable } = require('../../const/Paytable');
const { winRight } = require('../../const/function');
const { lines20 } = require('../../const/lines20');
// const { chekActionSpin } = require('../const/function');
function chekExpendingWild(matrix) {

    const newMatrix = [];
    let ExpWild = false;
    let indexWild = [];

    // let matrixTest = [
    //     ["2", "B", "A"],
    //     ["1", "2", "A"],
    //     ["A", "2", "A"],
    //     ["A", "B", "A"],
    //     ["A", "B", "A"],
    // ];
    console.log(matrix);

    matrix.forEach((el, index) => {
        let tempSymbol = el.filter(symbol => symbol != 2);
        if (tempSymbol.length < 3) {
            newMatrix.push(["2", "2", "2"]);
            ExpWild = true;
            let params = index;
            indexWild.push(params);
            return ExpWild;
        } else {
            newMatrix.push(el);
        }
    });
    console.log(newMatrix);
    return { newMatrix, ExpWild, indexWild };
}



for (let i = 0; i < 500; i++) {
    describe.skip('Test EW', function() {
        let data = {
            matrix: null,
            wild: 2,
            newMatrix: null,
            type: null,
            winAmount: 0,
            positions: null,
            featureEW: false,
            ExpWild: false,
            funcResult: false,
            isWinRun: false,
            winLinesWithoutNull: null,
            indexWild: null,
            allWinLines: null,
            oldBalance: 0
        };
        before("Spin", async() => {
            try {
                const res = await spinEW();
                console.log(res);
                expect(res.status.status).to.be.equal(200);
                let matrix = res.context.matrix;
                let funcResultExpW = chekExpendingWild(matrix);
                const funcResult = checkWin1(res);
                data = {...data, res, matrix, ...funcResultExpW, funcResult };

                if (res.context.hasOwnProperty("feature")) {
                    if (res.context.feature.hasOwnProperty("expendingWild")) {
                        let featureEW = true;
                        let obj = res.context.feature.expendingWild;
                        data = {...data, ...obj, featureEW };
                    }
                }

                if (funcResult !== null) {
                    let winLinesWithoutNull = funcResult.allWinLines.filter(winLines => winLines.id !== null);

                    if (funcResult.allWinLines[0].id == null) {
                        let isWinRun = true;
                        let winLinesNull = funcResult.allWinLines[0];
                        data = {...data, isWinRun, winLinesNull };
                    }
                    data = {...data, winLinesWithoutNull, ...funcResult };
                }


            } catch (error) {
                let { code, message } = data.res.status;
                console.log(code + "  code");
                console.log(message + "  message");
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it('check wild is expending', function() {
            let { newMatrix, wild } = data;
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
            let { ExpWild, matrix, indexWild } = data;
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
            let { res, winLinesWithoutNull, funcResult } = data;
            if (funcResult !== null) {
                let bet = res.context.bet;
                winLinesWithoutNull.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    console.log(winPositions);
                    console.log(winSymbol + " winSymbol");
                    const amount = el.amount;

                    function winRight() {
                        return PaytableCoef(winPositions, paytable, winSymbol) * bet;
                    }
                    let rightAmount = winRight();

                    expect(amount).to.be.equal(rightAmount);
                    console.log(amount + " amount " + rightAmount + " rightAmount");
                });
            }
        });
        it('check correct wining symbol position', function() {
            let { newMatrix, winLinesWithoutNull, funcResult } = data;
            if (funcResult !== null) {
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
                });
            }
        });
        it('check wining line', async() => {
            let { newmatrix, winLinesWithoutNull, funcResult } = data;
            if (funcResult !== null) {
                winLinesWithoutNull.forEach((el) => {
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
        it('check total amount is correct', () => {
            let { allWinLines, funcResult, res } = data;
            if (funcResult !== null) {
                let rightTotalAvount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                expect(rightTotalAvount).to.be.equal(res.context.win.total);
            }
        });
        // it('check correct add win to balanc', () => {
        //     let { res, oldBalance, funcResult } = data;
        //     let balance = res.user.balance;
        //     let bet = res.context.bet;
        //     if (funcResult !== null) {
        //         let win = res.context.win.total;
        //         data = {...data, oldBalance: balance };
        //         expect(oldBalance + win - bet).to.be.equal(balance);
        //         console.log(oldBalance + " oldBalance " + win + " win " + " - " + bet + " bet " + balance + " balance ");
        //     } else {
        //         expect(oldBalance - bet).to.be.equal(balance);
        //         console.log(oldBalance + " oldBalance " + " - " + bet + " bet " + balance + " balance ");
        //     }
        // });
    });
}