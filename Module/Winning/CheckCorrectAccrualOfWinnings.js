const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { winRight } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckCorrectAccrualOfWinnings(actionsSpin, res, winLinesWithoutScatter, FSMultipl, WildMultip, numberFS, paytable, UseMathModele, FSCount, FSChangeMultipl = 1) {
    if (winLinesWithoutScatter) {
        logger.info('check correct accrual of winnings in FS * 3');
        let bet = res.context.bet;

        winLinesWithoutScatter.forEach((line) => {
            logger.info(`winPositions - ${ line.positions }`);
            console.log(line.symbol);
            logger.info(`winSymbol - ${ line.symbol }`);

            const getingSymbols = [];
            line.positions.forEach((coordinates) => {
                const tempSymbols = res.context.matrix[coordinates[0]][coordinates[1]];
                getingSymbols.push(tempSymbols);
            });
            const arrWithWild = getingSymbols.filter((el) => el == "2");

            const amount = winRight(line.positions, paytable, line.symbol, bet);

            const multiplier = (arrWithWild.length > 0 && line.symbol !== "2") ? WildMultip : 1;
            const FSMultiplier = (UseMathModele.name === "Evo30") ? (FSChangeMultipl - 2) : FSMultipl;

            if (actionsSpin == "freespin" ||
                res.context.hasOwnProperty("freespins") && actionsSpin == "respin" && FSCount.add !== numberFS && FSCount.rest !== numberFS && FSCount.total !== numberFS) {
                let rightAmount = (amount * parseInt(multiplier) * FSMultiplier);
                console.log(FSMultiplier);
                console.log(rightAmount);
                console.log(line.amount);
                expect(line.amount).to.be.equal(rightAmount);
            } else {
                let rightAmount = (amount * parseInt(multiplier));
                console.log(rightAmount);
                console.log(line.amount);
                expect(line.amount).to.be.equal(rightAmount);
            }
        });
    }
}

module.exports = CheckCorrectAccrualOfWinnings;