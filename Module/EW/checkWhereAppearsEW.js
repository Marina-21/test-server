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

function checkWhereAppearsEW(funcResultExpW) {
    if (funcResultExpW.ExpWild) {
        logger.info('check the wild is not appeared in 1 and 5 reels');
        let fistReels = funcResultExpW.indexWild.includes(0);
        let lastReels = funcResultExpW.indexWild.includes(4);
        console.log(`fistReels - ${ fistReels }`);
        console.log(`lastReels - ${ lastReels }`);
        expect(fistReels).to.be.equal(false);
        expect(lastReels).to.be.equal(false);
    }
}

module.exports = checkWhereAppearsEW;