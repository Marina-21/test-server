const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { betLines, winRight } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


function CheckCorrectPositionScatter(winLinesScatter, res) {
    if (winLinesScatter) {
        logger.info('check correct position Scatter');
        console.log(winLinesScatter.positions);
        const symbolScatter = "1";

        winLinesScatter.positions.forEach((coordinate) => {
            const tempSymbols = res.context.matrix[coordinate[0]][coordinate[1]];
            console.log(tempSymbols);
            logger.info(`${ tempSymbols } - right symbol `);

            expect(symbolScatter).to.eql(tempSymbols);
        });

        console.log("position of wining Scatter is corect");
        logger.info("position of wining Scatter is corect");
    }
}

module.exports = CheckCorrectPositionScatter;