const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { paytable } = require('../const/Paytable');
const { PaytableCoef } = require('../const/function');
const { spin } = require('../const/spin');


chai.use(chaiHttp);


function checkWin1(res) {
    if (res.context.hasOwnProperty('win')) {
        const winLines = res.context.win.lines;
        const matrixSymbols = res.context.matrix;
        return {
            winLines,
            matrixSymbols
        }

    } else {
        console.log('spin without win');
        return null;
    }
};

function betLines(res) {
    let bet = res.context.bet;
    let counLines = res.context.lines;
    return bet / counLines;
};

let i = 0;
while (i < 10) {
    describe.skip('Test win', () => {
        let res = null;
        let isRun = false;
        let winLines = null;
        let matrixSymbols = null;

        before("Spin", async() => {
            res = await spin();

            expect(res.status.status).to.be.equal(200);

            const funcResult = checkWin1(res);


            if (funcResult !== null) {
                winLines = funcResult.winLines;
                matrixSymbols = funcResult.matrixSymbols;
                isRun = true;
            }
        });

        it('check correct wining symbol position', function() {
            if (isRun) {

                console.log((winLines.length) + "winLines");

                winLines.forEach((el) => {
                    if (el.id !== null) {
                        console.log(el.id);
                        const winPositions = el.positions;
                        console.log(winPositions);
                        const winSymbol = el.symbol;

                        winPositions.forEach((el) => {
                            const tempSymbols = matrixSymbols[el[0]][el[1]];
                            expect(winSymbol).to.be.equal(tempSymbols)
                        });
                        console.log([winSymbol] + " is correct position");

                    }
                });
            };
        });

        it('check correct accrual of winnings', function() {
            if (isRun) {
                let bet = betLines(res);
                winLines.forEach((el) => {
                    if (el.id !== null) {
                        const winPositions = el.positions;
                        const winSymbol = el.symbol;
                        const amount = el.amount;
                        const getingSymbols = [];
                        winPositions.forEach((el) => {
                            const coordinate = el;
                            const tempSymbols = matrixSymbols[el[0]][el[1]];
                            getingSymbols.push(tempSymbols);
                        });
                        const arrWithWild = getingSymbols.filter((value) => {
                            return el === "2";
                        });

                        function winRight() {
                            return PaytableCoef(winPositions, paytable, winSymbol) * bet;
                        };

                        if (arrWithWild.length > 0) {

                            expect(amount).to.be.equal(winRight() * 2);
                            console.log(winRight());
                            console.log(amount);


                        } else {
                            expect(amount).to.be.equal(winRight());
                            console.log(winRight());
                            console.log(amount);
                        };
                    };
                });
            };
        });
        i++
    });
};