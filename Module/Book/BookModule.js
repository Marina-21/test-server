const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const CheckExpendingWinIfFeaturePresent = require('../../Module/book/CheckExpendingWinIfFeaturePresent');
const CheckESymbolIfExpendingWinPresent = require('../../Module/book/CheckESymbolIfExpendingWinPresent');
const CheckESymbolIsNotScatter = require('../../Module/book/CheckESymbolIsNotScatter');
const CheckMatrixExpendingWin = require('../../Module/book/CheckMatrixExpendingWin');
const CheckAccrualWinningESymbol = require('../../Module/book/CheckAccrualWinningESymbol');
const CheckAccrualFSWinESymbol = require('../../Module/book/CheckAccrualFSWinESymbol');
const CheckTypeOfWin = require('../../Module/Common/CheckTypeOfWin');
const CheckESymbolIsCorrect = require('../../Module/book/CheckESymbolIsCorrect');


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


function BookModule(UseMathModele, data, Usepaytable) {

    if (UseMathModele.name === "Book") {
        describe("Test EW", () => {

            it('check response has expendingWin if there is feature "ESymbol"', function() {
                let { res, funcResultESymbol } = data;
                CheckExpendingWinIfFeaturePresent(res, funcResultESymbol);
            });
            it('check response has ESymbol if there is feature "expendingWin"', function() {
                let { actionsSpin, funcResultESymbol, res } = data;
                CheckESymbolIfExpendingWinPresent(actionsSpin, funcResultESymbol, res);

            });
            it('check ESymbol is correct', function() {
                let { actionsSpin, funcResultESymbol, res, globalDate } = data;
                CheckESymbolIsCorrect(actionsSpin, funcResultESymbol, globalDate);

            });
            it('check ESymbol is not wild/scatter', function() {
                let { actionsSpin, funcResultESymbol } = data;
                CheckESymbolIsNotScatter(actionsSpin, funcResultESymbol);

            });
            it('check new matrix with ESymbol is correct', function() {
                let { actionsSpin, funcResultESymbol, res } = data;
                CheckMatrixExpendingWin(actionsSpin, funcResultESymbol, res);

            });
            it('check correct accrual of winnings ESymbol', () => {
                let { actionsSpin, funcResultESymbol, res } = data;
                CheckAccrualWinningESymbol(actionsSpin, funcResultESymbol, res, Usepaytable);

            });
            it('check correct accrual fsWin with ESymbol', function() {
                let { actionsSpin, winLines, funcResultESymbol, res, globalDate } = data;
                CheckAccrualFSWinESymbol(actionsSpin, winLines, funcResultESymbol, res, globalDate);

            });
            it("check type of expendingWin", () => {
                let { res } = data;
                CheckTypeOfWin(res, "expendingWin");
            });
        })
    }
}

module.exports = BookModule;