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

async function wrightData(nextActionsSpin, FSCount, res, UseMathModele) {
    if (nextActionsSpin === "freespin" && FSCount.rest > 0) {
        const oldRest = res.context.freespins.count.rest;
        const oldTotal = res.context.freespins.count.total;
        const oldFsWin = res.context.freespins.win;
        const oldBalance = res.user.balance;
        let globalDate = { oldRest, oldTotal, oldFsWin, oldBalance };
        if (UseMathModele.name === "Book") {
            const oldESymbol = res.context.freespins.expendingSymbol;
            globalDate = {...globalDate, oldESymbol };
        }
        await fs.writeFile('db.json', JSON.stringify(globalDate));
    }
}

module.exports = wrightData;