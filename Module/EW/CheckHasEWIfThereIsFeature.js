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

function CheckHasEWIfThereIsFeature(featureEW, funcResultExpW) {
    if (featureEW) {
        logger.info('check response has "expending Wild" if there is "feature');
        console.log(`ExpWild - ${ funcResultExpW.ExpWild }`);

        expect(funcResultExpW.ExpWild).to.be.equal(true);
    }
}

module.exports = CheckHasEWIfThereIsFeature;