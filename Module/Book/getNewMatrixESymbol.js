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

function getNewMatrixESymbol(UseMathModele, res, actionsSpin, Usepaytable) {
    if (UseMathModele.name === "Book") {
        if (actionsSpin === "freespin") {
            const ESymbol = res.context.freespins.expendingSymbol;
            const numberESymbol = res.context.matrix.flat().filter(symbol => symbol === ESymbol).length;
            const minKoefESymbol = Object.keys(Usepaytable[ESymbol])[0];
            if (numberESymbol >= minKoefESymbol) {
                const newMatrix = [];
                res.context.matrix.forEach(el => {
                    let tempSymbol = el.filter(symbol => symbol === ESymbol);
                    if (tempSymbol.length >= 1) {
                        newMatrix.push([ESymbol, ESymbol, ESymbol]);
                    } else {
                        newMatrix.push(el);
                    }
                });
                const invertMatrix = newMatrix[0].map(el => { return []; });
                newMatrix.forEach(row => {
                    row.forEach((el, index) => {
                        invertMatrix[index].push(el);
                    });
                });
                return {
                    invertMatrix,
                    ESymbol
                };

            } else {
                return {
                    invertMatrix: null,
                    ESymbol
                };
            }
        }
    }
}

module.exports = getNewMatrixESymbol;