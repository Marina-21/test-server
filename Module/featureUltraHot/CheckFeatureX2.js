const _ = require('lodash');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function CheckFeatureX2(res) {
    if (res.context.hasOwnProperty("feature")) {
        if (res.context.feature.hasOwnProperty("multiplier")) {
            const multipResult = res.context.feature.multiplier;
            const multipWinSymbol = res.context.win.lines[0].symbol;
            return {
                multipResult,
                multipWinSymbol
            };
        }
    } else {
        return {
            multipResult: false,
            multipWinSymbol: false
        };
    }
}

module.exports = CheckFeatureX2;