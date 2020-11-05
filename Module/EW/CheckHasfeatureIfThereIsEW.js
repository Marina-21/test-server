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

function CheckHasfeatureIfThereIsEW(funcResultExpW, featureEW) {
    if (funcResultExpW.ExpWild) {
        logger.info('check response has "feature" if there is "expending Wild"');
        console.log(`featureEW - ${ featureEW.type }`);

        expect(featureEW.type).to.be.equal("expending_wild");
    }
}

module.exports = CheckHasfeatureIfThereIsEW;