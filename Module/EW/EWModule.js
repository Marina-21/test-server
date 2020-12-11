const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const CheckFeatureEW = require('./CheckFeatureEW');
const CheckWildIsExpending = require('./CheckWildIsExpending');
const checkWhereAppearsEW = require('./checkWhereAppearsEW');
const CheckHasEWIfThereIsFeature = require('./CheckHasEWIfThereIsFeature');
const CheckHasfeatureIfThereIsEW = require('./CheckHasfeatureIfThereIsEW');
const CheckScatterInReelsEW = require('./CheckScatterInReelsEW');
const CheckPositionEW = require('./CheckPositionEW');


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

function EWModule(UseMathModele, data) {

    if (UseMathModele.name === "EW") {
        describe("Test EW", () => {

            it('check wild is expending', function() {
                let { funcResultExpW, wild, } = data;
                CheckWildIsExpending(funcResultExpW, wild);
            });
            it('check the wild is not appeared in 1 and 5 reels', () => {
                let { funcResultExpW } = data;
                checkWhereAppearsEW(funcResultExpW);

            });
            it('check response has "expending Wild" if there is "feature"', function() {
                let { featureEW, funcResultExpW } = data;
                CheckHasEWIfThereIsFeature(featureEW, funcResultExpW);

            });
            it('check response has "feature" if there is "expending Wild"', () => {
                let { featureEW, funcResultExpW } = data;
                CheckHasfeatureIfThereIsEW(funcResultExpW, featureEW);

            });
            it('check response hasn`t scatter in reels "expending Wild"', () => {
                let { funcResultExpW, res } = data;
                CheckScatterInReelsEW(funcResultExpW, res);

            });
            it('check correct position of expending Wild', () => {
                let { featureEW, res } = data;
                CheckPositionEW(featureEW, res);

            });
        });
    }
}

module.exports = EWModule;