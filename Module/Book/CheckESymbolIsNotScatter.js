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

function CheckESymbolIsNotScatter(actionsSpin, funcResultESymbol) {
    if (actionsSpin === "freespin") {
        logger.info('check ESymbol is not wild/scatter');
        logger.info(`ESymbol - ${ funcResultESymbol.ESymbol }`);
        console.log(`ESymbol - ${ funcResultESymbol.ESymbol }`);
        const Scatter = 1;
        expect(funcResultESymbol.ESymbol).not.to.equal(Scatter);
    }
}

module.exports = CheckESymbolIsNotScatter;