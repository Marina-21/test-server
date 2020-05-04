// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');


const { spin } = require('../const/spin');
const { paytable } = require('../const/Paytable');
const PaytableCoef = require('../const/function');


chai.use(chaiHttp);

function checkWin(res) {
    if (res.context.hasOwnProperty('win')) {

        const winLine = res.context.win.lines[0];
        const winingId = res.context.win.lines[0].id;
        console.log((winingId) + "  winingId");

        if (winingId === null) {

            const symbol = 1;
            const winAmount = res.context.win.lines[0].amount;
            console.log("winAmount  " + (winAmount));
            return {
                symbol,
                winAmount
            };
        } else {
            console.log('the scatter did not fall out');
            return null;
        }
    } else {
        console.log("spin without wining");
        return null;
    }
}

for (let i = 0; i < 1; i++) {
    describe.skip('Spin', () => {
        let res = null;
        let isRun = false;
        let symbol = 1;
        let winAmount = null;


        before("Spin", async() => {
            try {
                res = await spin();

                expect(res.status.status).to.be.equal(200);

                const funcResult = checkWin(res);

                if (funcResult !== null) {
                    symbol = funcResult.symbol;
                    winAmount = funcResult.winAmount;
                    isRun = true;
                }
            } catch (error) {
                let { code, message } = res.status;
                console.log(code + "  code");
                console.log(message + "  message");
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('check correct accrual Scatter', function() {
            if (isRun) {
                console.log("symbol in IT " + symbol);
                console.log("res" + res);

                const bet = res.context.bet;
                const winRightNull = PaytableCoef(res, paytable, symbol) * bet;

                expect(winAmount).to.be.equal(winRightNull);
                console.log("scatter is accrualed correct");
            }
        });

        it('check correct position Scatter', function() {
            if (isRun) {
                const positionSymbols = res.context.win.lines[0].positions;
                const matrixSymbols = res.context.matrix;

                positionSymbols.forEach((el) => {
                    const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                    const tempSymbols = matrixSymbols[coordinate[0]][coordinate[1]];
                    expect(symbol).to.be.equal(Number(tempSymbols));
                });

                console.log("position of wining Scatter is corect");
            }
        });
    });

}