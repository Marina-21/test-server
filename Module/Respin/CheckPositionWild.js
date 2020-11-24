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

function CheckPositionWild(actionsSpin, funcResultRSpin) {
    if ((actionsSpin === 'respin')) {
        funcResultRSpin.wildDateRSpin.oldPositionWild.forEach(el => {
            const isFind = funcResultRSpin.positionWild.find((elNew) => {
                return elNew.index === el.index && _.isEqual(elNew.symbol, el.symbol);
            });
            logger.info('check correct position of Wild in respin');
            logger.info(funcResultRSpin.wildDateRSpin.oldPositionWild);
            logger.info(funcResultRSpin.positionWild);
            console.log(funcResultRSpin.wildDateRSpin.oldPositionWild);
            console.log(funcResultRSpin.positionWild);
            expect(isFind).not.to.equal(undefined);
        });
    }
}

module.exports = CheckPositionWild;