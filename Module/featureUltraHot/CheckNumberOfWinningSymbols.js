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

function CheckNumberOfWinningSymbols(winLines, res) {
    if (winLines) {
        logger.info('winning line consist of only 3 symbols');
        winLines.forEach(line => {
            console.log(line);
            logger.info(`winLin - ${line}`);
            expect(line.positions.length).to.equal(3);
        });
    }
}

module.exports = CheckNumberOfWinningSymbols;