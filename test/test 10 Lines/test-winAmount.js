// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { paytable } = require('../../const/Paytable');
const { PaytableCoef } = require('../../const/function');
const { spin } = require('../../const/spin');
const { checkWin1 } = require('../../const/function');


chai.use(chaiHttp);

for (let i = 0; i < 1; i++) {
    describe.skip('Test win', () => {

        let data = {
            res: null,
            winLinesWithoutScatter: null,
            matrix: null,
            actionSpin: null
        };

        before("Spin", async() => {
            try {
                let response = await spin();
                let { res, actionSpin } = response;

                console.log(`${actionSpin} - type of Spin`);

                const funcResult = checkWin1(res);

                if (funcResult !== null) {
                    let winLinesWithoutScatter = funcResult.allWinLines.filter(winLines => winLines.id !== null);
                    const matrix = res.context.matrix;

                    data = {...data, res, matrix, winLinesWithoutScatter, actionSpin };

                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });

        it('check correct winning symbol position', function() {
            let { winLinesWithoutScatter, matrix } = data;

            if (winLinesWithoutScatter != null) {

                console.log(`${winLinesWithoutScatter.length} - winLines.length`);

                winLinesWithoutScatter.forEach((el) => {
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
        });

        it('check correct accrual of winnings', function() {
            let { winLinesWithoutScatter, matrix, actionSpin, res } = data;

            if (winLinesWithoutScatter != null && actionSpin == "spin") {

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

                    let winRight = function() {
                        return PaytableCoef(winPositions, paytable, winSymbol) * bet;
                    };
                    let rightAmount = winRight();


                    if (arrWithWild.length > 0 && winSymbol !== "2") {
                        expect(amount).to.be.equal(rightAmount * 2);
                        console.log(rightAmount * 2);
                    } else {
                        expect(amount).to.be.equal(rightAmount);
                        console.log(rightAmount);
                    }

                });
            }
        });

    });
}