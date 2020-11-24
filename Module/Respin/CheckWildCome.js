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

function CheckWildCome(funcResultRSpin) {
    if (funcResultRSpin.wildInSpin) {
        logger.info('check the wild is not appeared in 1 and 5 reels');
        const fistReels = funcResultRSpin.indexWild.includes(0);
        const lastReels = funcResultRSpin.indexWild.includes(4);
        logger.info(`fistReels - ${ fistReels }`);
        logger.info(`lastReels - ${ lastReels }`);
        console.log(funcResultRSpin.indexWild);
        expect(fistReels).to.eql(false);
        expect(lastReels).to.eql(false);
    }
}

module.exports = CheckWildCome;