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

function CheckAccrualFSWinESymbol(actionsSpin, winLines, funcResultESymbol, res, globalDate) {
    if (actionsSpin === "freespin") {
        const fsWin = res.context.freespins.win;

        if (winLines || funcResultESymbol.invertMatrix) {
            logger.info('check correct accrual fsWin');
            let totalWin = 0;
            if (winLines) {
                let totalAmount = winLines.reduce((total, lines) => total + lines.amount, 0);
                console.log(`${ totalAmount } - totalAmount`);
                logger.info(`${ totalAmount } - totalAmount`);

                totalWin += totalAmount;
            }
            if (funcResultESymbol.invertMatrix) {
                let totalESymbol = res.context.expendingWin.win.lines.reduce((total, lines) => total + lines.amount, 0);
                console.log(`${ totalESymbol } - totalESymbol`);
                logger.info(`${ totalESymbol } - totalESymbol`);

                totalWin += totalESymbol;
            }
            console.log(`${ fsWin } - fsWin/ ${ globalDate.oldFsWin } + ${ totalWin } - oldFsWin + totalWin `);
            logger.info(`${ fsWin } - fsWin /${ globalDate.oldFsWin } + ${ totalWin } - oldFsWin + totalWin `);
            expect(fsWin).to.be.equal(globalDate.oldFsWin + totalWin);
        } else {
            console.log(`${ fsWin } - fsWin / ${ globalDate.oldFsWin } - oldFsWin `);
            logger.info(`${ fsWin } - fsWin / ${ globalDate.oldFsWin } - oldFsWin `);
            expect(fsWin).to.be.equal(globalDate.oldFsWin);
        }
    }
}

module.exports = CheckAccrualFSWinESymbol;