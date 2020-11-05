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

function CheckMatrixExpendingWin(actionSpin, funcResultESymbol, res) {
    if (actionSpin === "freespin" && funcResultESymbol.invertMatrix) {
        logger.info('check new matrix with ESymbol is correct');
        funcResultESymbol.invertMatrix.forEach((el, index) => {
            const value = _.isEqual(el, res.context.expendingWin.matrix[index]);
            expect(value).to.be.true;
        });
        logger.info(`NewMatrix - ${ funcResultESymbol.invertMatrix }`);
        console.log(`NewMatrix - ${ funcResultESymbol.invertMatrix }`);
        expect(res.context.hasOwnProperty("expendingWin")).to.eql(true);
    }
}

module.exports = CheckMatrixExpendingWin;