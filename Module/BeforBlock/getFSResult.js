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


async function getFSResult(nextActionsSpin, actionsSpin, res) {
    if (res.context.hasOwnProperty("freespins")) {
        const FSCount = res.context.freespins.count;
        console.log(FSCount.rest);
        logger.info(FSCount.rest);
        console.log(FSCount);
        logger.info(FSCount);

        const file = await fs.readFile('db.json', 'utf8');
        const fileData = JSON.parse(file);
        const globalDate = {...fileData };

        return {
            FSCount,
            globalDate
        };
    }
}

module.exports = getFSResult;