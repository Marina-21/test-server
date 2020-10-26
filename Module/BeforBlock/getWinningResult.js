const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { checkTypeWin } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function getWinningResult(winLines) {
    if (winLines) {
        const winLinesWithoutScatter = winLines.filter(lines => lines.id !== null);

        if (winLines[0].id == null) {
            let winLinesScatter = winLines[0];
            return {
                winLinesScatter,
                winLinesWithoutScatter
            };
        } else {
            return { winLinesWithoutScatter };
        }
    }
}

module.exports = getWinningResult;