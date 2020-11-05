const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const { winRight, checkWin1, checkSymbolMultiplier, checkTypeWin, readToken } = require('../../const/function');
const { spin } = require('../../const/spinPlatform');
const Platform = require('../../const/Platform');
const Game = require('../../const/Game');
const MathModele = require('../../const/MathModele');
const listpaytable = require('../dictionaries/paytable');
const listMathModele = require('../dictionaries/mathModele');
const listGame = require('../dictionaries/games.json');
const listPlatform = require('../dictionaries/platform');
const listlines = require('../dictionaries/lines');

const CheckFeatureX2 = require('../../Module/featureUltraHot/CheckFeatureX2');
const CheckNumberOfWinningSymbols = require('../../Module/featureUltraHot/CheckNumberOfWinningSymbols');
const CheckCorrectAccrualOfWinnings = require('../../Module/Winning/CheckCorrectAccrualOfWinnings');
const CheckCorrectPositionOfWinningSymbol = require('../../Module/Common/CheckCorrectPositionOfWinningSymbol');
const CheckWinningLineCoordinates = require('../../Module/Common/CheckWinningLineCoordinates');
const CheckTotalAmountIsCorrect = require('../../Module/Common/CheckTotalAmountIsCorrect');
const CheckResponseHasFeature = require('../../Module/featureUltraHot/CheckResponseHasFeature');
const CheckMultiplayer = require('../../Module/featureUltraHot/CheckMultiplayer');
const CheckTypeOfWin = require('../../Module/Common/CheckTypeOfWin');




const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

const platform = listPlatform[process.env.PLATFORM];
const Useplatform = new Platform(platform);
console.log(Useplatform.name);

const game = listGame[process.env.GAME];
const Usegame = new Game(game);

const mathModele = listMathModele[Usegame.nameMathModele];
const UseMathModele = new MathModele(mathModele);
const Usepaytable = listpaytable[UseMathModele.paytable];
const UseLines = listlines[UseMathModele.lines];

for (let i = 0; i < 1; i++) {
    describe.only(` Test${Usegame.name}, ${Usegame.getLines()}, ${Usegame.getId()} - ${i}`, () => {
        let data = {
            res: null,
            multipResult: null,
            winLines: null,
            multipWinSymbol: null,
            actionsSpin: null
        };

        before("Spin", async() => {
            try {
                let token = await readToken(Useplatform.nameToken);
                const response = await spin(Useplatform.getUrlSpin(), token, Usegame.getId(), Usegame.getBet(Useplatform), Usegame.getLines());
                let { nextActionsSpin, res } = response;
                let actionsSpin = res.context.current;
                console.log(res);
                logger.info(`Test 10Lines: game ${Usegame.name}: ${Usegame.getId()}, -  ${i}`);
                logger.info(res);

                const winLines = checkWin1(res);
                const { multipResult, multipWinSymbol } = CheckFeatureX2(res);

                data = {...data, res, winLines, multipResult, multipWinSymbol, actionsSpin };
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('winning line consist of only 3 symbols', () => {
            let { winLines, res } = data;
            CheckNumberOfWinningSymbols(winLines, res);

        });
        it('winAmount from response equal (bet x coef)', () => {
            let { actionsSpin, res, winLines } = data;
            CheckCorrectAccrualOfWinnings(actionsSpin, res, winLines, UseMathModele.FSMultipl, UseMathModele.WildMultip, Usepaytable);

        });
        it("check correct winning symbol position", () => {
            const { winLines, res } = data;
            CheckCorrectPositionOfWinningSymbol(winLines, res.context.matrix);

        });
        it('Winning Line coordinates from response is correct', async() => {
            const { winLines } = data;
            CheckWinningLineCoordinates(winLines, UseLines);

        });
        it("check total amount is correct", () => {
            const { winLines, res, multipResult } = data;
            CheckTotalAmountIsCorrect(winLines, res, multipResult.value);

        });
        it('check response has "feature" if there is "x 2"', () => {
            let { winLines, res, multipWinSymbol, multipResult } = data;
            CheckResponseHasFeature(winLines, res, multipWinSymbol, multipResult);

        });
        it('check multiplayer if there is a "feature', () => {
            let { multipResult, winLines, multipWinSymbol, res } = data;
            CheckMultiplayer(multipResult, winLines, Usepaytable, multipWinSymbol, res);

        });
        it("check type of win 5 Lines", () => {
            let { winLines, res } = data;
            CheckTypeOfWin(winLines, res, res.context.win);

        });
    });
}