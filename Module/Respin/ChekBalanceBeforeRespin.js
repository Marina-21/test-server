const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { betLines } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function ChekBalanceBeforeRespin(actionsSpin, nextActionsSpin, res, funcResultRSpin) {
    if (actionsSpin === "spin" && nextActionsSpin === "respin") {
        logger.info('win is not added to balance before respin');
        const newBalance = funcResultRSpin.wildDateRSpin.oldBalance - betLines(res);
        console.log(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance -  ${res.context.bet} * ${res.context.lines} `);
        logger.info(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance -  ${res.context.bet} * ${res.context.lines}`);
        expect(res.user.balance).to.be.equal(newBalance);
    }
}

module.exports = ChekBalanceBeforeRespin;