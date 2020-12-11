const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const CheckWildCome = require('../../Module/Respin/CheckWildCome');
const CheckWildIfThereIsFeatureRespin = require('../../Module/Respin/CheckWildIfThereIsFeatureRespin');
const CheckFeatureRespinIfThereIsWild = require('../../Module/Respin/CheckFeatureRespinIfThereIsWild');
const checkMax3Respin = require('../../Module/Respin/checkMax3Respin');
const CheckPositionWild = require('../../Module/Respin/CheckPositionWild');
const ChekBalanceBeforeRespin = require('../../Module/Respin/CheckBalanceRespinBeforFS');
const CheckBalanceAfterRespin = require('../../Module/Respin/CheckBalanceAfterRespin');
const CheckBalanceDuringRespin = require('../../Module/Respin/CheckBalanceDuringRespin');
const CheckBalanceRespinBeforFS = require('../../Module/Respin/CheckBalanceRespinBeforFS');
const CheckCorrectAccrualWinRSpin = require('../../Module/Respin/CheckCorrectAccrualWinRSpin');



const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

function RespinModule(UseMathModele, data) {

    if (UseMathModele.name === "PioneerRespin") {
        describe("Test Respin", () => {

            it('check the wild is not appeared in 1 and 5 reels', () => {
                let { funcResultRSpin } = data;
                CheckWildCome(funcResultRSpin);

            });
            it('check response has wild if there is feature "respin"', function() {
                let { res, funcResultRSpin } = data;
                CheckWildIfThereIsFeatureRespin(res, funcResultRSpin);

            });
            it('check response has feature "respin" if there is Wild', () => {
                let { res, funcResultRSpin } = data;
                CheckFeatureRespinIfThereIsWild(funcResultRSpin, res);

            });
            it('check a maximum of 3 respins after a Wild activates a respin', () => {
                let { funcResultRSpin } = data;
                checkMax3Respin(funcResultRSpin);

            });
            it('check correct position of Wild in respin', () => {
                let { actionsSpin, funcResultRSpin } = data;
                CheckPositionWild(actionsSpin, funcResultRSpin);

            });
            it('win is not added to balance before respin', function() {
                const { actionsSpin, nextActionsSpin, res, funcResultRSpin } = data;
                ChekBalanceBeforeRespin(actionsSpin, nextActionsSpin, res, funcResultRSpin);

            });
            it('respin win is added to balance', function() {
                const { funcResultRSpin, actionsSpin, nextActionsSpin, res } = data;
                CheckBalanceAfterRespin(funcResultRSpin, actionsSpin, nextActionsSpin, res);

            });
            it('balance is not change during respin', function() {
                const { actionsSpin, nextActionsSpin, res, funcResultRSpin } = data;
                CheckBalanceDuringRespin(actionsSpin, nextActionsSpin, res, funcResultRSpin);

            });
            it(' check balance do not change respin => freespin', async() => {
                let { funcResultRSpin, nextActionsSpin, actionsSpin, res } = data;
                CheckBalanceRespinBeforFS(funcResultRSpin, nextActionsSpin, actionsSpin, res);

            });
            it('check correct accrual WinRSpin', function() {
                let { winLines, res, funcResultRSpin } = data;
                CheckCorrectAccrualWinRSpin(winLines, res, funcResultRSpin);
            });
        });
    }
}

module.exports = RespinModule;