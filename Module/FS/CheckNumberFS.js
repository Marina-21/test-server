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

function CheckNumberFS(actionsSpin, nextActionsSpin, FSCount, numberFS) {
    if (actionsSpin === "spin" && nextActionsSpin === "freespin") {
        console.log(FSCount.total);
        expect(FSCount.total).to.equal(parseInt(numberFS));
        expect(FSCount.rest).to.equal(parseInt(numberFS));
        expect(FSCount.add).to.equal(parseInt(numberFS));
    }
}

module.exports = CheckNumberFS;