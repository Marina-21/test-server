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

function CheckExpendingWinIfFeaturePresent(res, funcResultESymbol) {
    if (res.context.hasOwnProperty("expendingWin")) {
        logger.info('check response has expendingWin if there is feature "ESymbol"');
        logger.info(`NewMatrix - ${ funcResultESymbol.invertMatrix }`);
        console.log(`NewMatrix - ${ funcResultESymbol.invertMatrix }`);
        expect(funcResultESymbol.invertMatrix).not.to.equal(null);
    }
}


module.exports = CheckExpendingWinIfFeaturePresent;