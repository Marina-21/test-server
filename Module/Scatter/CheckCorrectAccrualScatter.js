const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { betLines, winRight } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


function CheckCorrectAccrualScatter(winLinesScatter, actionsSpin, res, paytable, FSMultipl, UseMathModele, FSChangeMultipl = 1) {
    if (winLinesScatter) {
        logger.info('check correct accrual Scatter');
        const bet = betLines(res);
        const symbol = 1;
        console.log(winLinesScatter);
        if (actionsSpin === "freespin") {
            const FSMultiplier = (UseMathModele.name === "Evo30") ? (FSChangeMultipl - 2) : FSMultipl;
            const winRightScatter = winRight(winLinesScatter.positions, paytable, symbol, bet) * FSMultiplier;
            console.log(` ${ winLinesScatter.amount } - amount `);
            console.log(`${ winRightScatter } - winRightScatter `);

            expect(winLinesScatter.amount).to.be.equal(winRightScatter);
        } else {
            const winRightScatter = winRight(winLinesScatter.positions, paytable, symbol, bet);
            console.log(` ${ winLinesScatter.amount } - amount `);
            console.log(`${ winRightScatter } - winRightScatter `);

            expect(winLinesScatter.amount).to.be.equal(winRightScatter);
        }
    }
}

module.exports = CheckCorrectAccrualScatter;