const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const { readToken, checkWin1, chekExpendingWild } = require('../const/function');
const { spin } = require('../const/spinPlatform');
const Platform = require('../const/Platform');
const Game = require('../const/Game');
const MathModele = require('../const/MathModele');
const listpaytable = require('../dictionaries/paytable');
const listMathModele = require('../dictionaries/mathModele');
const listGame = require('../dictionaries/games.json');
const listPlatform = require('../dictionaries/platform');
const listlines = require('../dictionaries/lines');



const CheckWinningLineCoordinates = require('../Module/Common/CheckWinningLineCoordinates');
const CheckCorrectAccrualScatter = require('../Module/Scatter/CheckCorrectAccrualScatter');
const CheckCorrectPositionScatter = require('../Module/Scatter/CheckCorrectPositionScatter');
const CheckCorrectPositionOfWinningSymbol = require('../Module/Common/CheckCorrectPositionOfWinningSymbol');
const CheckCorrectAccrualOfWinnings = require('../Module/Winning/CheckCorrectAccrualOfWinnings');
const CheckTotalAmountIsCorrect = require('../Module/Common/CheckTotalAmountIsCorrect');
const CheckCorrectAddCountOfFS = require('../Module/FS/CheckCorrectAddCountOfFS');
const CheckCorrectTotalFS = require('../Module/FS/CheckCorrectTotalFS');
const CheckNumberFS = require('../Module/FS/CheckNumberFS');
const CheckRestFS = require('../Module/FS/CheckRestFS');
const BalanceIsNotChange = require('../Module/FS/BalanceIsNotChange');
const CheckCorrectAccrualFSWin = require('../Module/FS/CheckCorrectAccrualFSWin');
const CheckCorrectAddFSWinToBalance = require('../Module/FS/CheckCorrectAddFSWinToBalance');
const CheckTypeOfWin = require('../Module/Common/CheckTypeOfWin');
const getWinningResult = require('../Module/BeforBlock/getWinningResult');
const getFSResult = require('../Module/BeforBlock/getFSResult');
const getLog = require('../Module/BeforBlock/getLog');
const wrightData = require('../Module/AfterBlock/wrightData');
const CheckFeatureEW = require('../Module/EW/CheckFeatureEW');
const EWModule = require('../Module/EW/EWModule');
const getNewMatrixESymbol = require('../Module/book/getNewMatrixESymbol');
const BookModule = require('../Module/book/BookModule');
const CheckMultipFS = require('../Module/Evo30/CheckMultipFS');

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
let numberErrors = 0;


for (let i = 0; i < 50; i++) {
    describe.only(`Test 10Lines game: ${Usegame.getLines()}, ${Usegame.getId()} -  ${i}`, () => {

        let data = {
            winLines: null,
            nextActionsSpin: null,
            res: null,
            FSCount: null,
            actionsSpin: null,
            winLinesScatter: null,
            winLinesWithoutScatter: null,
            globalDate: null,
            funcResultExpW: null,
            featureEW: null,
            funcResultESymbol: null,
            winRSpin: null,
            wildDateRSpin: null,
            numberRSpin: null,
            funcResultRSpin: null,
            FSChangeMultipl: 1
        };

        before("Spin", async() => {
            try {
                let token = await readToken(Useplatform.nameToken);
                const response = await spin(Useplatform.getUrlSpin(), token, Usegame.getId(), Usegame.getBet(Useplatform), Usegame.getLines());
                let { nextActionsSpin, res } = response;
                getLog(res, Usegame.name, Usegame.getId(), i);

                let actionsSpin = res.context.current;
                const winLines = checkWin1(res);
                const winningResult = getWinningResult(winLines);
                const FSResult = await getFSResult(nextActionsSpin, actionsSpin, res);
                let funcResultExpW = chekExpendingWild(UseMathModele, res);
                const funcResultESymbol = getNewMatrixESymbol(UseMathModele, res, actionsSpin, Usepaytable);
                const featureEW = CheckFeatureEW(res);
                const FSChangeMultipl = CheckMultipFS(UseMathModele, actionsSpin, res, FSResult);


                data = { res, nextActionsSpin, actionsSpin, winLines, funcResultExpW, funcResultESymbol, featureEW, FSChangeMultipl, ...winningResult, ...FSResult };

            } catch (error) {
                // numberErrors += 1;
                // if (numberErrors > 5) {
                //     break;
                // };
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
        it('Winning Line coordinates from response is correct', () => {
            const { winLinesWithoutScatter } = data;
            CheckWinningLineCoordinates(winLinesWithoutScatter, UseLines);

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
        it('check correct accrual of winnings', () => {
            const { actionsSpin, res, winLinesWithoutScatter, FSChangeMultipl } = data;
            CheckCorrectAccrualOfWinnings(actionsSpin, res, winLinesWithoutScatter, UseMathModele.FSMultipl, UseMathModele.WildMultip, Usepaytable, UseMathModele, FSChangeMultipl);

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
        it('Check the number of free spins', () => {
            const { actionsSpin, nextActionsSpin, FSCount } = data;
            CheckNumberFS(actionsSpin, nextActionsSpin, FSCount, UseMathModele.numberFS);
        });
        it('check rest FS', () => {
            const { actionsSpin, FSCount, globalDate } = data;
            CheckRestFS(actionsSpin, FSCount, globalDate, UseMathModele.numberFS);

        });
        it('balance is not change', () => {
            const { actionsSpin, FSCount, res, globalDate, nextActionsSpin } = data;
            BalanceIsNotChange(actionsSpin, FSCount, res, globalDate, nextActionsSpin);

        });
        it('check correct accrual FSWin', function() {
            const { actionsSpin, winLines, res, globalDate } = data;
            CheckCorrectAccrualFSWin(actionsSpin, UseMathModele, winLines, res, globalDate);

        });
        it('check correct add FSWin to balance', function() {
            const { nextActionsSpin, FSCount, globalDate, res } = data;
            CheckCorrectAddFSWinToBalance(nextActionsSpin, FSCount, globalDate, res);

        });
        it("check type of win Lines", () => {
            let { res } = data;
            CheckTypeOfWin(res);

        });
        it("EWModule", () => {
            EWModule(UseMathModele, data);

        });
        it("BookModule", () => {
            BookModule(UseMathModele, data, Usepaytable);

        });
        after("wright", async() => {
            let { FSCount, res, nextActionsSpin, FSChangeMultipl, funcResultRSpin } = data;
            wrightData(nextActionsSpin, FSCount, res, UseMathModele, funcResultRSpin, FSChangeMultipl);

        });
    });
}