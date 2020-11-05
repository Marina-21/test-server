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

function CheckPositionEW(featureEW, res) {
    if (featureEW) {
        logger.info('check correct position of expending Wild');
        let wildPositions = [];
        res.context.matrix.forEach((el, index) => {
            let getingposition = el.indexOf("2");
            if (getingposition >= 0) {
                wildPositions.push([index, getingposition]);
            }
        });
        const value = _.isEqual(wildPositions, featureEW.positions);
        console.log('wildPositions ' + [wildPositions] + '  positions feature ' + [featureEW.positions]);
        logger.info(`wildPositions - ${wildPositions}/ positions feature - ${featureEW.positions}`);

        expect(value).to.be.true;
    }
}

module.exports = CheckPositionEW;