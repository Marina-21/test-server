const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const _ = require('lodash');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


const { betLines } = require('../const/function');
const { spin } = require('../const/spinPlatform');
const { Dev } = require('../const/platforms');
const { favorit } = require('../const/platforms');
const { checkWin1 } = require('../const/function');

chai.use(chaiHttp);

let { urlSpin, token, gamesDate, bets } = Dev;
let { id, lines } = gamesDate[10];
let elbet = bets[2];

chai.use(chaiHttp);

for (let i = 0; i < 100; i++) {
    describe.skip('Test type of win', () => {
        let data = {
            funcResultWin: false,
            actionNow: null,
            isWinScatter: false,
            winLinesScatter: null,
            gameTypeWin: null,
            res: null,
            isWinWild: false
        };

        before("Spin", async() => {
            try {
                const responce = await spin(urlSpin, token, id, elbet, lines);
                let { res, actionSpin } = responce;
                console.log(res);
                console.log(actionSpin);

                const funcResultWin = checkWin1(res);
                let actionNow = res.context.current;

                data = { res, actionSpin, funcResultWin, actionNow };

                if (funcResultWin !== null) {
                    const gameTypeWin = res.context.win.type;
                    console.log((gameTypeWin) + '  - gameTypeWin');

                    let winLinesWithoutScatter = funcResultWin.allWinLines.filter(winLines => winLines.id !== null);
                    let winLinesWithoutFeature = [];
                    let winLinesWild = [];
                    winLinesWithoutScatter.forEach(line => {
                        let winSymbol = line.symbol;
                        if (winSymbol == 2) {
                            winLinesWild.push(line);
                            let isWinWild = true;
                            data = {...data, isWinWild };
                        } else {
                            winLinesWithoutFeature.push(line);
                        }
                    });

                    if (funcResultWin.allWinLines[0].id == null) {
                        let isWinScatter = true;
                        let winLinesScatter = funcResultWin.allWinLines[0];
                        data = {...data, isWinScatter, winLinesScatter };
                    }

                    data = {...data, winLinesWithoutFeature, ...funcResultWin, gameTypeWin, winLinesWild };
                }
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it("check type of win", () => {
            let {
                actionNow,
                funcResultWin,
                winLinesWithoutFeature,
                isWinWild,
                res,
                gameTypeWin,
                winLinesScatter,
                winLinesWild,
                isWinScatter
            } = data;

            if (funcResultWin !== null && actionNow == "spin") {
                const bet = betLines(res);
                let betLine = res.context.bet;
                let arrRightTypeWin = [];

                if (winLinesWithoutFeature !== null) {
                    console.log(winLinesWithoutFeature);

                    let totalWin = winLinesWithoutFeature.reduce((total, line) => total + line.amount, 0);
                    const typeCoef = totalWin / bet;
                    arrRightTypeWin.push(typeCoef);
                }
                if (isWinWild) {
                    console.log(winLinesWild);
                    winLinesWild.forEach(line => {
                        let amount = line.amount;
                        const typeCoef = amount / betLine;
                        arrRightTypeWin.push(typeCoef);
                    });
                }
                if (isWinScatter) {
                    console.log(winLinesScatter);
                    let amount = winLinesScatter.amount;
                    const typeCoef = amount / bet;
                    arrRightTypeWin.push(typeCoef);
                }
                let typeCoef = arrRightTypeWin.reduce((total, coef) => total + coef, 0);
                let rightTypeWin;
                console.log((typeCoef) + " - typeCoef");
                if (typeCoef < 12.5) {
                    rightTypeWin = "regular";
                } else if (typeCoef >= 12.5 && typeCoef < 100) {
                    rightTypeWin = "big";
                } else if (typeCoef >= 100 && typeCoef < 500) {
                    rightTypeWin = "ultra";
                } else if (typeCoef >= 500 && typeCoef <= 1500) {
                    rightTypeWin = "mega";
                }
                expect(gameTypeWin).to.be.eq(rightTypeWin);
            }
        });
    });
}


// status: { ok: true, code: 200, message: '' },
//     user: { currency: 'EUR', balance: 169136767, i18n: 'en' },
//     context: {
//         current: 'spin',
//         actions: ['spin'],
//         matrix: [
//             [Array],
//             [Array],
//             [Array],
//             [Array],
//             [Array]
//         ],
//         bet: 6,
//         lines: 20,
//         win: { total: 1080, type: 'regular', lines: [Array] },
//         feature: { expendingWild: [Object] }
//     }
// }