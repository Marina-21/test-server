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

function checkMax3Respin(funcResultRSpin) {
    if (funcResultRSpin.wildInSpin) {
        logger.info('check a maximum of 3 respins after a Wild activates a respin');
        logger.info(`numberRSpin - ${ funcResultRSpin.numberRSpin }`);
        console.log(funcResultRSpin.numberRSpin);
        expect(funcResultRSpin.numberRSpin).to.be.at.most(3);
    }
}

module.exports = checkMax3Respin;