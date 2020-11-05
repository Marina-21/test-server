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

function CheckESymbolIfExpendingWinPresent(actionsSpin, funcResultESymbol, res) {
    if (actionsSpin === "freespin" && funcResultESymbol.invertMatrix) {
        logger.info('check response has ESymbol if there is feature "expendingWin"');
        logger.info(`ESymbol - ${ funcResultESymbol.ESymbol }`);
        console.log(`ESymbol - ${ funcResultESymbol.ESymbol }`);
        expect(res.context.hasOwnProperty("expendingWin")).to.eql(true);
    }

}

module.exports = CheckESymbolIfExpendingWinPresent;