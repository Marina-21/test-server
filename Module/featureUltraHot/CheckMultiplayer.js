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

function CheckMultiplayer(multipResult, winLines, paytable, multipWinSymbol, res) {
    if (multipResult) {
        logger.info('check multiplayer if there is a "feature');

        const amount = winRight(winLines[0].positions, paytable, multipWinSymbol, res.context.bet);
        let rightAmountMult = amount * res.context.lines * 2;

        console.log(`${rightAmountMult} x2 - there is "feature`);
        logger.info(`${rightAmountMult} x2 - there is "feature`);

        expect(res.context.win.total).to.be.equal(rightAmountMult);
        expect(multipResult.win).to.be.equal(rightAmountMult);
    }
}

module.exports = CheckMultiplayer;