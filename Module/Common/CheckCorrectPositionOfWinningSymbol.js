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

function CheckCorrectPositionOfWinningSymbol(UseMathModele, res, funcResultExpW, winLinesWithoutScatter) {
    const matrix = (UseMathModele.name === "EW") ? funcResultExpW.newMatrix : res.context.matrix;
    if (winLinesWithoutScatter) {
        logger.info('check correct position of winning symbol');
        const wild = (UseMathModele.name === "Book") ? "1" : "2";

        winLinesWithoutScatter.forEach((line) => {
            console.log(`${ line.id } - id `);
            logger.info(`${ line.id } - id `);

            line.positions.forEach((coordinate) => {
                const tempSymbols = matrix[coordinate[0]][coordinate[1]];
                if (tempSymbols !== wild) {
                    expect(line.symbol).to.be.eql(tempSymbols);
                } else {
                    expect(wild).to.eql(tempSymbols);
                    console.log('there is a wild in the pay line');
                    logger.info('there is a wild in the pay line');
                }
            });
            console.log([line.symbol] + " is correct position");
            logger.info([line.symbol] + " is correct position");
        });
    }
}

module.exports = CheckCorrectPositionOfWinningSymbol;