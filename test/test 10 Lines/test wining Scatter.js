// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');


const { spin } = require('../../const/spin');
const { paytable } = require('../../const/Paytable');
const { PaytableCoef } = require('../../const/function');
const { betLines } = require('../../const/function');
const { checkWin1 } = require('../../const/function');


chai.use(chaiHttp);


for (let i = 0; i < 5; i++) {
    describe.skip('Spin', () => {

        let data = {
            res: null,
            isWinScatter: false,
            symbol: 1,
            winAmount: null,
            winLinesScatter: null
        };



        before("Spin", async() => {
            try {
                let response = await spin();
                let { res } = response;

                const funcResultWin = checkWin1(res);

                if (funcResultWin !== null && funcResultWin.allWinLines[0].id == null) {
                    let isWinScatter = true;
                    let winLinesScatter = funcResultWin.allWinLines[0];
                    let winAmount = winLinesScatter.amount;
                    data = {...data, isWinScatter, winAmount, res, winLinesScatter };
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('check correct accrual Scatter in main game', function() {
            let { isWinScatter, res, symbol, winLinesScatter, winAmount } = data;

            if (isWinScatter) {

                console.log("symbol in IT " + symbol);
                let winPositions = winLinesScatter.positions;
                console.log(winPositions);

                const bet = betLines(res);
                const winRightNull = PaytableCoef(winPositions, paytable, symbol) * bet;
                console.log(`${winAmount} - amount`);
                console.log(`${winRightNull} - winRightNull`);
                expect(winAmount).to.be.equal(winRightNull);
                console.log("scatter is accrualed correct");
            }
        });

        it('check correct position Scatter', function() {
            let { isWinScatter, res, symbol, winLinesScatter } = data;

            if (isWinScatter) {
                const positionSymbols = winLinesScatter.positions;
                const matrix = res.context.matrix;

                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                    console.log(tempSymbols);
                    expect(symbol).to.be.equal(Number(tempSymbols));
                });

                console.log("position of wining Scatter is corect");
            }
        });
    });

}