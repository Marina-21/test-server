const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { checkTypeWin } = require('../../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckTypeOfWin(winLines, res) {
    if (winLines) {
        logger.info("check type of win 10 Lines");
        const gameTypeWin = res.context.win.type;

        let rightTypeWin = checkTypeWin(res);

        logger.info(`${ rightTypeWin } - rightTypeWin `);

        expect(gameTypeWin).to.eql(rightTypeWin);
        console.log("Type of win is correct");
    }
}

module.exports = CheckTypeOfWin;