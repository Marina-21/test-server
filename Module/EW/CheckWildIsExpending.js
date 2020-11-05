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

function CheckWildIsExpending(funcResultExpW) {
    logger.info('check wild is expending');
    const wild = 2;
    funcResultExpW.newMatrix.forEach((el) => {
        let tempSymbol = el.filter(symbol => symbol == wild);
        console.log(`tempSymbol.length = ${tempSymbol.length}`);
        expect(tempSymbol.length).to.not.have.any.keys(0, 3);
    });
}

module.exports = CheckWildIsExpending;