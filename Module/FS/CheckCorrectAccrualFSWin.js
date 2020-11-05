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


function CheckCorrectAccrualFSWin(actionsSpin, UseMathModele, winLines, res, globalDate) {
    if (actionsSpin === "freespin" && UseMathModele.name !== "Book") {
        if (winLines) {
            console.log(`${ res.context.freespins.win } - fsWin
    / ${ globalDate.oldFsWin } + ${ res.context.win.total } - oldFsWin + totalAmount `);

            expect(res.context.freespins.win).to.be.equal(globalDate.oldFsWin + res.context.win.total);
        } else {
            console.log(`${ res.context.freespins.win } - FSWin / ${ globalDate.oldFsWin } - oldFsWin `);

            expect(res.context.freespins.win).to.be.equal(globalDate.oldFsWin);
        }
    }
}

module.exports = CheckCorrectAccrualFSWin;