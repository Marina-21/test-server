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

function CheckBalanceDuringRespin(actionsSpin, nextActionsSpin, res, funcResultRSpin) {
    if (actionsSpin === "respin" && nextActionsSpin === "respin") {
        console.log(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance `);
        logger.info(` ${ res.user.balance } - balance / ${ funcResultRSpin.wildDateRSpin.oldBalance } - oldBalance `);
        expect(res.user.balance).to.be.equal(funcResultRSpin.wildDateRSpin.oldBalance);
    }
}

module.exports = CheckBalanceDuringRespin;