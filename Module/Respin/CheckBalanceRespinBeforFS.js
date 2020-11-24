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

function CheckBalanceRespinBeforFS(funcResultRSpin, nextActionsSpin, actionsSpin, res) {
    if (nextActionsSpin == "freespin" && actionsSpin == "respin") {
        logger.info('check balance do not change respin => freespin');
        logger.info(`balance- &{balance}`);
        logger.info(`balance- &{balance}`);
        expect(res.user.balance).to.equal(funcResultRSpin.wildDateRSpin.oldBalance);
    }
}

module.exports = CheckBalanceRespinBeforFS;