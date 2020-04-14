const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { serverUrl } = require('../const/list');
const { paytable } = require('../const/coefSymbols');

chai.use(chaiHttp);

const route = '/spin';
const paramsSpin = {
    token: "f7aad3f8cbd8e21754f71e78f7f53c7a",
    gameId: 4,
    params: {
        lines: 10,
        bet: 60
    },
    action: "spin"
};

describe.skip('Test win', () => {

    it('spin', (done) => {
        chai.request(serverUrl)
            .post(route)
            .set('content-type', 'application/json')
            .send(JSON.stringify(paramsSpin))
            .end((err, res) => {

                const body = JSON.parse(res.text);
                expect(body.status.status).to.be.equal(200);

                if (body.context.hasOwnProperty('win')) {

                    const positionSymbols = body.context.win.lines[0].positions; //[0, 0],[1, 0],[2, 0]

                    const matrixSymbols = body.context.matrix; //[E, A, F], [E, B, C], [2, E, A]....

                    const getingSymbols = [];

                    positionSymbols.forEach((el) => {
                        const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                        const tempSymbols = matrixSymbols[coordinate[0]][coordinate[1]];
                        getingSymbols.push(tempSymbols);
                    });

                    const arrWithWild = getingSymbols.filter((el) => {
                        return el === "2";
                    });

                    function PaytableCoef() {
                        const symbol = body.context.win.lines[0].symbol;
                        const countSymbol = body.context.win.lines[0].positions.length;
                        const coef = paytable[symbol];
                        const coefCount = coef[countSymbol];
                        return coefCount;
                    };

                    function betLines() {
                        const bet = body.context.bet;
                        const counLines = body.context.lines;
                        return bet / counLines;
                    };
                    const amount = body.context.win.lines[0].amount;

                    function winSpin() {
                        return PaytableCoef() * betLines();
                    };

                    if (arrWithWild.length > 0) {

                        expect(amount).to.be.equal(winSpin() * 2);
                        console.log(winSpin());
                        console.log(amount);

                        done();
                    } else {
                        expect(amount).to.be.equal(winSpin());
                        console.log(winSpin());
                        console.log(amount);
                        done();
                    }
                } else {
                    console.log('spin without win');
                    done();
                }

            });
    });
});