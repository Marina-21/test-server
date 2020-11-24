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

async function wrightData(nextActionsSpin, FSCount, res, UseMathModele, funcResultRSpin, FSChangeMultipl = 1) {
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
        if (UseMathModele.name === "Evo30") {
            globalDate = {...globalDate, FSChangeMultipl };
        }
        await fs.writeFile('db.json', JSON.stringify(globalDate));
    }
    if (UseMathModele.name === "PioneerRespin") {
        let wildDateRSpin;
        const oldBalance = res.user.balance;
        wildDateRSpin = { oldBalance };
        if (nextActionsSpin === "respin") {
            const oldPositionWild = funcResultRSpin.positionWild;
            const oldIndexWild = funcResultRSpin.indexWild;
            const oldWinRSpin = res.context.respin.total;
            const numberRSpin = funcResultRSpin.numberRSpin;
            // const numberRSpin = 0;
            wildDateRSpin = {...wildDateRSpin, oldPositionWild, oldIndexWild, oldBalance, oldWinRSpin, numberRSpin };
        }
        if (nextActionsSpin === "spin") {
            const oldWinRSpin = 0;
            wildDateRSpin = {...wildDateRSpin, oldWinRSpin };
        }
        await fs.writeFile('db2.json', JSON.stringify(wildDateRSpin));
    }
}

module.exports = wrightData;