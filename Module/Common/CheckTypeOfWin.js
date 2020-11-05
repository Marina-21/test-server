const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const { checkTypeWin } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckTypeOfWin(res, typeWin = 'win') {

    if (res.context.hasOwnProperty([typeWin])) {
        logger.info("check type of win 10 Lines");

        let gameTypeWin;
        if (typeWin === 'win') {
            gameTypeWin = res.context[typeWin].type;
        } else {
            gameTypeWin = res.context[typeWin].win.type;
        }
        let rightTypeWin = checkTypeWin(res, typeWin);

        logger.info(`${ gameTypeWin } - gameTypeWin `);
        console.log(`${ gameTypeWin } - gameTypeWin `);
        logger.info(`${ rightTypeWin } - rightTypeWin `);
        console.log(`${ rightTypeWin } - rightTypeWin `);

        expect(gameTypeWin).to.be.eql(rightTypeWin);
        console.log("Type of win is correct");
    }
}

module.exports = CheckTypeOfWin;