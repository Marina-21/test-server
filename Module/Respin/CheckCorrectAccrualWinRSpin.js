const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckCorrectAccrualWinRSpin(winLines, res, funcResultRSpin) {
    if (res.context.hasOwnProperty("respin") && !res.context.hasOwnProperty("freespins")) {
        logger.info('check correct accrual WinRSpin');
        if (winLines) {
            let totalAmount = res.context.win.total;
            console.log(`${funcResultRSpin.winRSpin } - winRSpin/ ${funcResultRSpin.wildDateRSpin.oldWinRSpin } + ${ totalAmount } - oldWinRSpin + totalAmount `);
            logger.info(`${ funcResultRSpin.winRSpin } - winRSpin/ ${ funcResultRSpin.wildDateRSpin.oldWinRSpin } + ${ totalAmount } - oldWinRSpin + totalAmount `);
            expect(funcResultRSpin.winRSpin).to.be.equal(funcResultRSpin.wildDateRSpin.oldWinRSpin + totalAmount);
        } else {
            console.log(`${funcResultRSpin.winRSpin } - winRSpin / ${ funcResultRSpin.wildDateRSpin.oldWinRSpin } - oldWinRSpin`);
            logger.info(`${funcResultRSpin.winRSpin } - winRSpin / ${ funcResultRSpin.wildDateRSpin.oldWinRSpin }  - oldWinRSpin`);
            expect(funcResultRSpin.winRSpin).to.be.equal(funcResultRSpin.wildDateRSpin.oldWinRSpin);
        }
    }
}

module.exports = CheckCorrectAccrualWinRSpin;