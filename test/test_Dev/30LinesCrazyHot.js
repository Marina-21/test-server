const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
require('dotenv').config();


const { checkWin1, winRight, readToken, betLines, checkTypeWin } = require('../../const/function');
const { paytable30LinesCrazy } = require('../../const/Paytable');
const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');
const { spin } = require('../../const/spinPlatform');
const { lines30Crazy } = require('../../const/lines');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

const platform = {
    Favorit: Favorit,
    Gizil: Gizil,
    Dev: Dev,
    OMG: OMG,
    Favoritsport: Favoritsport,
    FavBet: FavBet
};


let { urlSpin, gamesDate, bet, nameToken } = platform[process.env.PLATFORM];
const [nameGame] = [process.env.GAME];
console.log(nameGame);

const indexGame = gamesDate.findIndex((el) => { return el.name === nameGame; });
console.log(indexGame);

const game = gamesDate[indexGame];

let { id, lines, name } = gamesDate[game.number];
let elbet = gamesDate[game.number][bet][2];


const iter = async() => {
    for (let i = 0; i < 2; i++) {
        describe.only(`Test 30 Lines Crazy Hot ${i}`, () => {
            let data = {
                allWinLines: null,
                res: null,
                matrix: null,

                total: 0,
                balance: 0,
                funcResultWin: null,
                bet: 0,
                winLinesWithoutScatter: null,
                winLinesScatter: null,
                isWinScatter: null

            };


            before("Spin", async() => {

                try {
                    let token = await readToken(nameToken);
                    const response = await spin(urlSpin, token, id, elbet, lines);
                    let { res } = response;
                    console.log(res);
                    logger.info(`Test 30Lines: game: ${id}, -  ${i}`);
                    logger.info(res);

                    const funcResultWin = checkWin1(res);
                    const matrix = res.context.matrix;
                    let bet = res.context.bet;


                    data = {...data, res, matrix, funcResultWin, bet };

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
                    logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
                }
            });
            it('winAmount from response equal (bet x coef)', () => {
                let { funcResultWin, bet, winLinesWithoutScatter } = data;

                if (funcResultWin !== null) {
                    winLinesWithoutScatter.forEach(el => {
                        logger.info('winAmount from response equal (bet x coef)');
                        let winPositions = el.positions;
                        let winSymbol = el.symbol;
                        let amount = el.amount;
                        let rightAmount = winRight(winPositions, paytable30LinesCrazy, winSymbol, bet);
                        console.log(` ${ amount } - amount `);
                        logger.info(` ${ amount } - amount `);
                        console.log(` ${ rightAmount } - winRightNull `);
                        logger.info(` ${ rightAmount } - winRightNull `);

                        expect(amount).to.be.equal(rightAmount);
                    });
                }
            });
            it("check correct winning symbol position", () => {
                let { funcResultWin, winLinesWithoutScatter, matrix } = data;

                if (funcResultWin !== null) {
                    logger.info('check correct wining symbol position');
                    winLinesWithoutScatter.forEach(el => {
                        let winSymbol = el.symbol;
                        let winPosition = el.positions;

                        winPosition.forEach((el) => {
                            const tempSymbols = matrix[el[0]][el[1]];
                            if (tempSymbols !== "2") {
                                expect(winSymbol).to.be.equal(tempSymbols);
                            } else {
                                expect("2").to.be.equal(tempSymbols);
                                console.log('there is a wild in the pay line');
                                logger.info('there is a wild in the pay line');
                            }
                        });
                        console.log([winSymbol] + " is correct position");
                        logger.info([winSymbol] + " is correct position");
                    });
                }
            });
            it('check correct accrual Scatter', () => {
                let { res, winLinesScatter, isWinScatter } = data;

                if (isWinScatter == true) {
                    logger.info('check correct accrual Scatter');
                    const bet = betLines(res);
                    const symbol = 1;
                    const amount = winLinesScatter.amount;
                    const winPositions = winLinesScatter.positions;
                    console.log(winLinesScatter);
                    logger.info(winLinesScatter);
                    const winRightNull = winRight(winPositions, paytable30LinesCrazy, symbol, bet);

                    console.log(` ${ amount } - amount `);
                    logger.info(`${ amount } - amount `);
                    console.log(`${ winRightNull } - winRightNull `);
                    logger.info(`${ winRightNull } - winRightNull `);

                    expect(amount).to.be.equal(winRightNull);
                }
            });
            it('check correct position Scatter', () => {
                let { winLinesScatter, isWinScatter, matrix } = data;

                if (isWinScatter == true) {
                    logger.info('check correct position Scatter');
                    const positionSymbols = winLinesScatter.positions;
                    console.log(positionSymbols);
                    const symbol = 1;

                    positionSymbols.forEach((el) => {
                        const coordinate = el; // [0, 0] coordinate[0] coordinate[1]
                        const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                        console.log(tempSymbols);
                        logger.info(`${ tempSymbols } - right symbol `);

                        expect(symbol).to.be.equal(Number(tempSymbols));
                    });

                    console.log("position of wining Scatter is corect");
                    logger.info("position of wining Scatter is corect");
                }
            });
            it('Winning Line coordinates from response is correct', async() => {
                let { funcResultWin, winLinesWithoutScatter } = data;

                if (funcResultWin !== null) {
                    logger.info('Winning Line coordinates from response is correct');
                    winLinesWithoutScatter.forEach(el => {
                        let winPosition = el.positions;
                        const idLines = el.id;
                        const numberLines = lines30Crazy[idLines];
                        const coordinatesLines = numberLines.slice(0, winPosition.length);
                        console.log(coordinatesLines);
                        logger.info(`rightCoordinatesLines - ${coordinatesLines}`);
                        const value = _.isEqual(winPosition, coordinatesLines);
                        expect(value).to.be.true;
                    });
                }
            });
            it("check total amount is correct", () => {
                let { funcResultWin, allWinLines, res } = data;

                if (funcResultWin !== null) {
                    logger.info('check total amount is correct');
                    let rightAmount = allWinLines.reduce((total, lines) => total + lines.amount, 0);

                    expect(+rightAmount).to.be.equal(res.context.win.total);
                }
            });

            it("check type of win 30 Lines", () => {
                let { funcResultWin, res } = data;

                if (funcResultWin !== null) {
                    logger.info("check type of win 30 Lines");
                    const gameTypeWin = res.context.win.type;

                    let rightTypeWin = checkTypeWin(res);

                    logger.info(`${rightTypeWin} - rightTypeWin`);

                    expect(gameTypeWin).to.eql(rightTypeWin);
                    logger.info("Type of win is correct");
                }
            });
        });
    }
};

iter();