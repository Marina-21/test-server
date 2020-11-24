// const chai = require('chai');
// const expect = chai.expect;
// const _ = require('lodash');
// const fs = require('fs').promises;

// const log4js = require('log4js');
// log4js.configure({
//     appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
//     categories: { default: { appenders: ['cheese'], level: 'error' } }
// });
// const logger = log4js.getLogger();
// logger.level = 'debug';

// async function CheckRespinFeature(res, actionsSpin) {
//     if (res.context.hasOwnProperty("respin")) {

//         // const file = await fs.readFile('db2.json', 'utf8');
//         // let { oldPositionWild, numberRSpin = 0, oldIndexWild, oldBalance, oldWinRSpin } = JSON.parse(file);
//         // const wildDateRSpin = { oldPositionWild, oldIndexWild, oldBalance, oldWinRSpin };

//         // if (actionsSpin === "respin") {
//         //     numberRSpin++;
//         //     console.log(`numberRSpin - ${ numberRSpin }`);
//         // } else {
//         //     numberRSpin = 0;
//         // }

//         //     const winRSpin = res.context.respin.total;

//         //     const featureRSpin = { winRSpin, numberRSpin };

//         //     return {
//         //         featureRSpin,
//         //     };
//         // }
//     }

//     module.exports = CheckRespinFeature;