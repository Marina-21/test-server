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

function CheckCorrectAddCountOfFS(actionsSpin, res, FSCount, numberFS) {
    if (actionsSpin === "freespin") {
        logger.info('check correct add count of FS');

        const arrScatter = [];
        res.context.matrix.forEach((symbol) => {
            let getScatter = symbol.filter(value => value === 1);
            if (getScatter.length > 0) {
                arrScatter.push(...getScatter);
            }
        });

        if (arrScatter.length > 2) {
            console.log(FSCount.add + " add ");
            logger.info(FSCount.add + " add ");
            expect(FSCount.add).to.be.equal(numberFS);
        } else {
            console.log(FSCount.add + " add");
            logger.info(FSCount.add + " add ");
            expect(FSCount.add).to.equal(0);
        }
    }
}

module.exports = CheckCorrectAddCountOfFS;