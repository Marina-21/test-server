const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const { checkWin1, readToken, betLines } = require('../../const/function');
const { spin } = require('../../const/spinPlatform');
const Platform = require('../../const/Platform');
const Game = require('../../const/Game');
const MathModele = require('../../const/MathModele');
const listpaytable = require('../dictionaries/paytable');
const listMathModele = require('../dictionaries/mathModele');
const listGame = require('../dictionaries/games.json');
const listPlatform = require('../dictionaries/platform');
const listlines = require('../dictionaries/lines');

const getLog = require('../../Module/BeforBlock/getLog');
const CheckWildRSpin = require('../../Module/Respin/CheckWildRSpin');
const getWinningResult = require('../../Module/BeforBlock/getWinningResult');
const getFSResult = require('../../Module/BeforBlock/getFSResult');
const CheckWildCome = require('../../Module/Respin/CheckWildCome');
const CheckWildIfThereIsFeatureRespin = require('../../Module/Respin/CheckWildIfThereIsFeatureRespin');
const CheckFeatureRespinIfThereIsWild = require('../../Module/Respin/CheckFeatureRespinIfThereIsWild');
const checkMax3Respin = require('../../Module/Respin/checkMax3Respin');
const wrightData = require('../../Module/AfterBlock/wrightData');
const CheckPositionWild = require('../../Module/Respin/CheckPositionWild');
const ChekBalanceBeforeRespin = require('../../Module/Respin/CheckBalanceRespinBeforFS');
const CheckBalanceAfterRespin = require('../../Module/Respin/CheckBalanceAfterRespin');
const CheckBalanceDuringRespin = require('../../Module/Respin/CheckBalanceDuringRespin');
const CheckBalanceRespinBeforFS = require('../../Module/Respin/CheckBalanceRespinBeforFS');
const CheckCorrectAccrualWinRSpin = require('../../Module/Respin/CheckCorrectAccrualWinRSpin');
const CheckCorrectAccrualOfWinnings = require('../../Module/Winning/CheckCorrectAccrualOfWinnings');
const CheckWinningLineCoordinates = require('../../Module/Common/CheckWinningLineCoordinates');
const CheckCorrectAccrualScatter = require('../../Module/Scatter/CheckCorrectAccrualScatter');
const CheckCorrectPositionScatter = require('../../Module/Scatter/CheckCorrectPositionScatter');
const CheckCorrectPositionOfWinningSymbol = require('../../Module/Common/CheckCorrectPositionOfWinningSymbol');
const CheckTotalAmountIsCorrect = require('../../Module/Common/CheckTotalAmountIsCorrect');
const CheckCorrectAddCountOfFS = require('../../Module/FS/CheckCorrectAddCountOfFS');
const CheckCorrectTotalFS = require('../../Module/FS/CheckCorrectTotalFS');
const CheckNumberFS = require('../../Module/FS/CheckNumberFS');
const CheckRestFS = require('../../Module/FS/CheckRestFS');
const BalanceIsNotChange = require('../../Module/FS/BalanceIsNotChange');
const CheckCorrectAccrualFSWin = require('../../Module/FS/CheckCorrectAccrualFSWin');
const CheckCorrectAddFSWinToBalance = require('../../Module/FS/CheckCorrectAddFSWinToBalance');
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
    describe.only(`Test game: ${Usegame.getLines()}, ${Usegame.getId()} -  ${i}`, () => {
        let data = {
            winLinesWithoutScatter: null,
            winLinesScatter: null,
            actionsSpin: null,
            funcResultRSpin: null,
            nextActionsSpin: null,
            res: null,
            globalDate: null,
            winLines: null,
            FSCount: null,
            funcResultRSpinFeatute: null,
            featureRSpin: null
        };
        before("Spin", async() => {
            try {
                let token = await readToken(Useplatform.nameToken);
                const response = await spin(Useplatform.getUrlSpin(), token, Usegame.getId(), Usegame.getBet(Useplatform), Usegame.getLines());
                const { nextActionsSpin, res } = response;
                getLog(res, Usegame.name, Usegame.getId(), i);

                const actionsSpin = res.context.current;
                const winLines = checkWin1(res);
                const funcResultRSpin = await CheckWildRSpin(res, UseMathModele, actionsSpin);
                // const funcResultRSpinFeatute = await CheckRespinFeature(res, actionsSpin);
                const winningResult = getWinningResult(winLines);
                const FSResult = await getFSResult(nextActionsSpin, actionsSpin, res);


                data = {...data, ...winningResult, ...FSResult, funcResultRSpin, res, nextActionsSpin, actionsSpin, winLines };

                // const file = await fs.readFile('db2.json', 'utf8');
                // const { oldBalance } = JSON.parse(file);
                // wildDate = {...wildDate, oldBalance };
            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
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
            CheckBalanceDuringRespin(actionsSpin, nextActionsSpin, res, funcResultRSpin)

        });
        it(' check balance do not change respin => freespin', async() => {
            let { funcResultRSpin, nextActionsSpin, actionsSpin, res } = data;
            CheckBalanceRespinBeforFS(funcResultRSpin, nextActionsSpin, actionsSpin, res)

        });
        it('check correct accrual WinRSpin', function() {
            let { winLines, res, funcResultRSpin } = data;
            CheckCorrectAccrualWinRSpin(winLines, res, funcResultRSpin)

        });
        it('check correct accrual of winnings', () => {
            const { actionsSpin, res, winLinesWithoutScatter, FSChangeMultipl } = data;
            CheckCorrectAccrualOfWinnings(actionsSpin, res, winLinesWithoutScatter, UseMathModele.FSMultipl, UseMathModele.WildMultip, Usepaytable, UseMathModele, FSChangeMultipl);
        });
        it('check correct accrual Scatter', () => {
            const { winLinesScatter, actionsSpin, res, FSChangeMultipl } = data;
            CheckCorrectAccrualScatter(winLinesScatter, actionsSpin, res, Usepaytable, UseMathModele.FSMultipl, UseMathModele, FSChangeMultipl);

        });
        it('check correct position Scatter', () => {
            const { winLinesScatter, res } = data;
            CheckCorrectPositionScatter(winLinesScatter, res);

        });
        it('check correct position of winning symbol', () => {
            const { res, funcResultExpW, winLinesWithoutScatter } = data;
            CheckCorrectPositionOfWinningSymbol(UseMathModele, res, funcResultExpW, winLinesWithoutScatter);

        });
        it('Winning Line coordinates from response is correct', () => {
            const { winLinesWithoutScatter } = data;
            CheckWinningLineCoordinates(winLinesWithoutScatter, UseLines);

        });
        it('check total amount is correct', () => {
            const { winLines, res } = data;
            CheckTotalAmountIsCorrect(winLines, res);

        });
        it('check correct add count of FS', () => {
            const { actionsSpin, res, FSCount } = data;
            CheckCorrectAddCountOfFS(actionsSpin, res, FSCount, UseMathModele.numberFS);

        });
        it('check correct total FS', () => {
            const { actionsSpin, FSCount, globalDate } = data;
            CheckCorrectTotalFS(actionsSpin, globalDate, FSCount);

        });
        it('check correct accrual FSWin', function() {
            const { actionsSpin, winLines, res, globalDate } = data;
            CheckCorrectAccrualFSWin(actionsSpin, UseMathModele, winLines, res, globalDate);

        });
        it('balance is not change', () => {
            const { actionsSpin, FSCount, res, globalDate, nextActionsSpin } = data;
            BalanceIsNotChange(actionsSpin, FSCount, res, globalDate, nextActionsSpin);

        });
        // it('balance is not change in freespin with respin', async() => {
        //     let { balance, actionSpin, actionNow } = data;
        //     let { oldBalance } = wildDate;
        //     if (actionSpin == "respin" && actionNow == "freespin" || actionSpin == "freespin" && actionNow == "respin") {
        //         logger.info('balance is not change');

        //         console.log(` ${ balance } - balance / ${ oldBalance } - oldBalance `);
        //         logger.info(` ${ balance } - balance / ${ oldBalance } - oldBalance `);

        //         expect(balance).to.equal(oldBalance);
        //     }
        // });
        it('check rest FS', () => {
            const { actionsSpin, FSCount, globalDate } = data;
            CheckRestFS(actionsSpin, FSCount, globalDate, UseMathModele.numberFS);

        });
        it('check correct add FSWin to balance', function() {
            const { nextActionsSpin, FSCount, globalDate, res } = data;
            CheckCorrectAddFSWinToBalance(nextActionsSpin, FSCount, globalDate, res);

        });
        it("check type of win Lines", () => {
            let { res } = data;
            CheckTypeOfWin(res);

        });
        after("wright", async() => {
            let { FSCount, res, nextActionsSpin, funcResultRSpin, FSChangeMultipl } = data;
            wrightData(nextActionsSpin, FSCount, res, UseMathModele, funcResultRSpin, FSChangeMultipl);

        });
    });
}