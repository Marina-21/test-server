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

function CheckFeatureRespinIfThereIsWild(funcResultRSpin, res) {
    if (funcResultRSpin.wildInSpin) {
        logger.info('check response has feature "respin" if there is Wild');
        logger.info(`winRSpin - ${ funcResultRSpin.winRSpin }`);
        console.log(`winRSpin - ${ funcResultRSpin.winRSpin }`);
        expect(res.context.hasOwnProperty("respin")).to.be.equal(true);
    }
}

module.exports = CheckFeatureRespinIfThereIsWild;