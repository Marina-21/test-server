// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { paytable } = require('../../const/Paytable');
const { PaytableCoef } = require('../../const/function');
const { spin } = require('../../const/spin');
const { spinFavbet } = require('../../const/spinFavbet');


chai.use(chaiHttp);


const checkWin1 = (res) => {
    if (res.context.hasOwnProperty('win')) {

        const allWinLines = res.context.win.lines;
        let matrixSymbols = res.context.matrix;

        return {
            allWinLines,
            matrixSymbols
        };

    } else {
        console.log('spin without win');
        return null;
    }
};

for (let i = 0; i < 500; i++) {
    describe.skip('Test win', () => {
        let res = null;
        let isRun = false;
        let winLines = null;
        let matrixSymbols = null;

        before("Spin", async() => {
            try {
                res = await spin();
                console.log(res.context.current + "   type of Spin");

                expect(res.status.status).to.be.equal(200);

                const funcResult = checkWin1(res);


                if (funcResult !== null) {
                    winLines = funcResult.allWinLines.filter(winLines => winLines.id !== null);

                    matrixSymbols = funcResult.matrixSymbols;
                    console.log(matrixSymbols);

                    isRun = true;
                }
            } catch (error) {
                let { code, message } = res.status;
                console.log(code + "  code");
                console.log(message + "  message");
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });

        it('check correct wining symbol position', function() {
            if (isRun) {

                console.log((winLines.length) + "winLines");

                winLines.forEach((el) => {
                    console.log(el.id);
                    const winPositions = el.positions;
                    console.log(winPositions);
                    const winSymbol = el.symbol;

                    winPositions.forEach((el) => {
                        const tempSymbols = matrixSymbols[el[0]][el[1]];
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
            if (isRun) {
                let bet = res.context.bet;
                winLines.forEach((el) => {
                    const winPositions = el.positions;
                    const winSymbol = el.symbol;
                    const amount = el.amount;
                    console.log(amount);
                    const getingSymbols = [];
                    winPositions.forEach((el) => {
                        const tempSymbols = matrixSymbols[el[0]][el[1]];
                        getingSymbols.push(tempSymbols);
                    });
                    const arrWithWild = getingSymbols.filter((value) => {
                        return value === "2";
                    });

                    function winRight() {
                        return PaytableCoef(winPositions, paytable, winSymbol) * bet;
                    }

                    if (arrWithWild.length > 0 && winSymbol !== "2") {
                        expect(amount).to.be.equal(winRight() * 2);
                        console.log(winRight());


                    } else {
                        expect(amount).to.be.equal(winRight());
                        console.log(winRight());
                        console.log(amount);
                    }

                });
            }
        });

    });
}