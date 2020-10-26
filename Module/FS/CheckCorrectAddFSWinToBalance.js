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

function CheckCorrectAddFSWinToBalance(actionsSpin, FSCount, globalDate, res) {
    if (actionsSpin === "freespin") {
        if (FSCount.rest === 0 && FSCount.add === 0) {
            const rightBalance = globalDate.oldBalance + res.context.freespins.win;
            console.log("!!! balance " + res.user.balance);
            console.log("!!! rightBalance " + rightBalance);
            console.log("!!! fsWin " + res.context.freespins.win);

            expect(res.user.balance).to.equal(rightBalance);
        }
    }
}

module.exports = CheckCorrectAddFSWinToBalance;