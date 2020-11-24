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

function CheckWildIfThereIsFeatureRespin(res, funcResultRSpin) {
    if (res.context.hasOwnProperty("respin")) {
        logger.info('check response has wild if there is feature "respin"');
        logger.info(`wildInSpin - ${ funcResultRSpin.wildInSpin }`);
        console.log(`wildInSpin - ${ funcResultRSpin.wildInSpin }`);
        expect(funcResultRSpin.wildInSpin).to.eql(true);
    }
}

module.exports = CheckWildIfThereIsFeatureRespin;