const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { winRight } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckAccrualWinningESymbol(actionSpin, funcResultESymbol, res, Usepaytable) {
    if (actionSpin === "freespin" && funcResultESymbol.invertMatrix) {
        logger.info('check correct accrual of winnings');
        const bet = res.context.bet;
        const winESymbol = res.context.expendingWin.win;

        const rightAmount = winRight(winESymbol.lines[0].positions, Usepaytable, winESymbol.lines[0].symbol, bet) * res.context.lines;
        console.log(winESymbol.total + " amount " + rightAmount + " rightAmount");
        logger.info(winESymbol.total + " amount " + rightAmount + " rightAmount");

        expect(winESymbol.total).to.be.equal(rightAmount);
    }
}

module.exports = CheckAccrualWinningESymbol;