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

function checkRestFS(actionsSpin, FSCount, globalDate, numberFS) {
    if (actionsSpin == "freespin") {
        let rightRest;
        if (FSCount.add > 0) {
            rightRest = globalDate.oldRest - 1 + parseInt(numberFS);
        } else {
            rightRest = globalDate.oldRest - 1;
        }
        console.log(`${ rightRest } - rightRest `);
        logger.info(`${ rightRest } - rightRest `);

        expect(FSCount.rest).to.eql(rightRest);
    }
}

module.exports = checkRestFS;