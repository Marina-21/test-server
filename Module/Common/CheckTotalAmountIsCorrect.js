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

function CheckTotalAmountIsCorrect(winLines, res, multipResult = 1) {
    if (winLines) {
        logger.info('check total amount is correct');
        let rightTotalAmount = winLines.reduce((total, lines) => total + lines.amount, 0);
        console.log(`rightTotalAmount - ${ rightTotalAmount }`);
        expect(rightTotalAmount * multipResult).to.be.equal(res.context.win.total);
    }
}

module.exports = CheckTotalAmountIsCorrect;