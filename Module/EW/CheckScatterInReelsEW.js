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

function CheckScatterInReelsEW(funcResultExpW, res) {
    if (funcResultExpW.ExpWild) {
        logger.info('check response hasn`t scatter in reels "expending Wild"');
        const scatter = 1;
        let arrScatter = [];
        funcResultExpW.indexWild.forEach((index) => {
            let tempSymbol = res.context.matrix[index].filter(symbol => symbol == scatter);
            arrScatter.push(...tempSymbol);
        });
        console.log(`arrScatter.length- ${arrScatter.length} = 0`);

        expect(arrScatter.length).to.equal(0);
    }
}

module.exports = CheckScatterInReelsEW;