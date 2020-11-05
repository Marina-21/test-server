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

function CheckWinningLineCoordinates(winLinesWithoutScatter, linesCoordinates) {
    if (winLinesWithoutScatter) {
        logger.info('Winning Line coordinates from response is correct');
        winLinesWithoutScatter.forEach((line) => {
            console.log(line.positions);
            logger.info(`winPositions - ${ line.positions}`);
            const numberLines = linesCoordinates[line.id];
            const coordinatesLines = numberLines.slice(0, line.positions.length);
            const value = _.isEqual(line.positions, coordinatesLines);
            console.log(coordinatesLines);
            logger.info(`rightCoordinatesLines - ${ coordinatesLines }`);
            expect(coordinatesLines.length).to.eql(line.positions.length);
            expect(value).to.be.true;
        });
    }
}

module.exports = CheckWinningLineCoordinates;