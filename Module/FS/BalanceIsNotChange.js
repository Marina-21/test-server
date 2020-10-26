const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function BalanceIsNotChange(actionsSpin, FSCount, res, globalDate) {
    if (actionsSpin == "freespin") {
        if (FSCount.rest > 0) {
            console.log(`${ res.user.balance } - balance / ${ globalDate.oldBalance } - oldBalance `);
            logger.info(`${ res.user.balance } - balance / ${ globalDate.oldBalance } - oldBalance `);

            expect(res.user.balance).to.be.equal(globalDate.oldBalance);
        }
    }
}

module.exports = BalanceIsNotChange;