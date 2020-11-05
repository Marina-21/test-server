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

function CheckResponseHasFeature(winLines, res, multipWinSymbol, multipResult) {
    if (winLines && winLines.length === 5) {
        logger.info('check response has "feature" if identical symbols in the matrix');
        const arrSymbols = [];
        res.context.matrix.forEach(el => {
            let tempSymbol = el.filter(symbol => symbol == multipWinSymbol);
            arrSymbols.push(...tempSymbol);
        });
        if (arrSymbols.length === 9) {
            expect(multipResult.value).to.be.equal(2);
        } else {
            expect(multipResult).to.equal(false);
        }
    }
}

module.exports = CheckResponseHasFeature;