const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');



// const { freespin } = require('../const/spin');
const { spinEW } = require('../../const/SpinExpendingWild');
const { checkWin1 } = require('../../const/function');
const { PaytableCoef } = require('../../const/function');
const { paytable20LinesEW } = require('../../const/Paytable');
const { winRight } = require('../../const/function');
const { lines20 } = require('../../const/lines20');
const { betLines } = require('../../const/function');
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
    describe.only('Test EW', function() {
        let data = {
            matrix: null,
            wild: 2,
            newMatrix: null,
            featureEW: false,
            ExpWild: false,
            funcResultWin: false,
            isWinScater: false,
            winLinesWithoutScatter: null,
            indexWild: null,
            allWinLines: null,
            oldBalance: 0,
            actionSpin: null
        };
        before("Spin", async() => {
            try {
                const responce = await spinEW();
                let { actionSpin, res } = responce;
                console.log(res);
                console.log(`actionSpin  ${actionSpin}`);

                let matrix = res.context.matrix;
                let funcResultExpW = chekExpendingWild(matrix);
                const funcResultWin = checkWin1(res);
                data = {...data, res, matrix, ...funcResultExpW, funcResultWin };

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


            } catch (error) {
                let { code, message } = error;
                console.log(code + "  code");
                console.log(message + "  message");
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
            let { res, winLinesWithoutScatter, funcResultWin } = data;
            if (funcResultWin !== null) {
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
            let { res, winLinesScatter, isWinScatter, funcResultWin, } = data;
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
        it('check correct wining symbol position', function() {
            let { newMatrix, winLinesWithoutScatter, funcResultWin } = data;
            if (funcResultWin !== null) {
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
            let { newMatrix, winLinesScatter, isWinScatter, funcResultWin, } = data;
            if (funcResultWin !== null && isWinScatter == true) {
                console.log(funcResultWin);

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
            let { winLinesWithoutScatter, funcResultWin } = data;
            if (funcResultWin !== null) {
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
        it('check total amount is correct', () => {
            let { allWinLines, funcResultWin, res } = data;
            if (funcResultWin !== null) {
                let rightTotalAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);
                expect(rightTotalAmount).to.be.equal(res.context.win.total);
            }
        });

    });
}