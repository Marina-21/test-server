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

function getLog(res, name, id, i) {
    logger.info(`Test 10Lines game: ${name}, ${id} -  ${i}`);
    console.log(res);
    logger.info(res);
    console.log(res.context.matrix);
    logger.info(res.context.matrix);
    if (res.context.hasOwnProperty("win")) {
        console.log(res.context.win);
        logger.info(res.context.win);
    }
}

module.exports = getLog;