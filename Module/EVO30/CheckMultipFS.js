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

function CheckMultipFS(UseMathModele, actionsSpin, res, FSResult) {
    if (UseMathModele.name === "Evo30" && actionsSpin === "freespin") {
        if (res.context.hasOwnProperty("win") && FSResult.globalDate.FSChangeMultipl <= 9) {
            console.log(`${FSResult.globalDate.FSChangeMultipl} + 2`);
            return FSResult.globalDate.FSChangeMultipl += 2;
        } else {
            console.log(FSResult.globalDate.FSChangeMultipl);
            return FSResult.globalDate.FSChangeMultipl;
        }
    }
}

module.exports = CheckMultipFS;