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

async function CheckWildRSpin(res, UseMathModele, actionsSpin) {
    if (UseMathModele.name === "PioneerRespin") {
        let wildInSpin = false;
        let indexWild = [];
        let positionWild = [];
        res.context.matrix.forEach((el, index) => {
            let tempSymbol = el.filter(symbol => symbol == '2');
            if (tempSymbol.length > 0) {
                indexWild.push(index);
                positionWild.push({ index, symbol: el });
                wildInSpin = true;
            }
        });
        const file = await fs.readFile('db2.json', 'utf8');
        let { oldPositionWild, numberRSpin = 0, oldIndexWild, oldBalance, oldWinRSpin } = JSON.parse(file);
        const wildDateRSpin = { oldPositionWild, oldIndexWild, oldBalance, oldWinRSpin };

        let winRSpin;
        if (res.context.hasOwnProperty("respin")) {
            winRSpin = res.context.respin.total;
        }
        if (actionsSpin === "respin") {
            numberRSpin++;
            console.log(`numberRSpin - ${ numberRSpin }`);
        } else {
            numberRSpin = 0;
        }

        return { wildInSpin, indexWild, positionWild, wildDateRSpin, numberRSpin, winRSpin };
    }
}

module.exports = CheckWildRSpin;