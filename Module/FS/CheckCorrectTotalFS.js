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


function CheckCorrectTotalFS(actionsSpin, globalDate, FSCount) {
    if (actionsSpin == "freespin") {
        logger.info('check correct total FS');
        const { oldTotal } = globalDate;

        if (FSCount.add != 0) {
            console.log(`${ oldTotal + FSCount.add } - oldTotal FS + rest Fs ${ FSCount.total } - total FS `);
            logger.info(`${ oldTotal + FSCount.add } - oldTotal FS + rest Fs ${ FSCount.total } - total FS `);
            expect(oldTotal + FSCount.add).to.equal(FSCount.total);
        } else {
            console.log(`${ oldTotal } - oldTotal FS ${ FSCount.total } - total FS `);
            logger.info(`${ oldTotal } - oldTotal FS ${ FSCount.total } - total FS `);
            expect(oldTotal).to.equal(FSCount.total);
        }
    }
}

module.exports = CheckCorrectTotalFS;