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

function CheckBalanceAfterRespin(funcResultRSpin, actionsSpin, nextActionsSpin, res) {
    if (actionsSpin === "respin" && nextActionsSpin === "spin") {
        logger.info('respin win is added to balance');
        const newBalance = funcResultRSpin.wildDateRSpin.oldBalance + funcResultRSpin.winRSpin;
        console.log(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance + ${funcResultRSpin.winRSpin} `);
        logger.info(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance  + ${funcResultRSpin.winRSpin}`);
        expect(res.user.balance).to.be.equal(newBalance);
    }
}

module.exports = CheckBalanceAfterRespin;