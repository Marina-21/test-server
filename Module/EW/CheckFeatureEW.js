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

function CheckFeatureEW(res) {
    if (res.context.hasOwnProperty("feature")) {
        if (res.context.feature.hasOwnProperty("expendingWild")) {
            let featureEW = res.context.feature.expendingWild;
            return featureEW;
        } else {
            return null;
        }
    }
}

module.exports = CheckFeatureEW;