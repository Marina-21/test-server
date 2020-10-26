const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs').promises;
require('dotenv').config();

const { getGame, readToken, checkWin1 } = require('../const/function');
const { paytable } = require('../const/Paytable');
const { spin } = require('../const/spinPlatform');
const { lines10 } = require('../const/lines');
const Platform = require('../const/Platform');

const CheckWinningLineCoordinates = require('../Module/Common/Common/CheckWinningLineCoordinates');
const CheckCorrectAccrualScatter = require('../Module/Scatter/CheckCorrectAccrualScatter');
const CheckCorrectPositionScatter = require('../Module/Scatter/CheckCorrectPositionScatter');
const CheckCorrectPositionOfWinningSymbol = require('../Module/Common/Common/CheckCorrectPositionOfWinningSymbol');
const CheckCorrectAccrualOfWinnings = require('../Module/Winning/CheckCorrectAccrualOfWinnings');
const CheckTotalAmountIsCorrect = require('../Module/Common/Common/CheckTotalAmountIsCorrect');
const CheckCorrectAddCountOfFS = require('../Module/FS/CheckCorrectAddCountOfFS');
const CheckCorrectTotalFS = require('../Module/FS/CheckCorrectTotalFS');
const CheckNumberFS = require('../Module/FS/CheckNumberFS');
const CheckRestFS = require('../Module/FS/CheckRestFS');
const BalanceIsNotChange = require('../Module/FS/BalanceIsNotChange');
const CheckCorrectAccrualFSWin = require('../Module/FS/CheckCorrectAccrualFSWin');
const CheckCorrectAddFSWinToBalance = require('../Module/FS/CheckCorrectAddFSWinToBalance');
const CheckTypeOfWin = require('../Module/Common/Common/CheckTypeOfWin');
const getWinningResult = require('../Module/BeforBlock/getWinningResult');
const getFSResult = require('../Module/BeforBlock/getFSResult');
const getLog = require('../Module/BeforBlock/getLog');


const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

const listPlatform = require('../dictionaries/platform');
const platform = listPlatform[process.env.PLATFORM];
const Useplatform = new Platform(platform);
console.log(Useplatform.name);

let { name, id, lines, elbet } = getGame(process.env.GAME, Useplatform);

for (let i = 0; i < 1; i++) {
    describe.only(`Test 10Lines game: ${name}, ${id} -  ${i}`, () => {

        let data = {
            winLines: null,
            nextActionsSpin: null,
            res: null,
            FSCount: null,
            actionsSpin: null,
            winLinesScatter: null,
            winLinesWithoutScatter: null,
            numberFS: 15,
            FSMultipl: 3,
            WildMultip: 2,
            globalDate: null
        };

        const peoneerConfig = {
            numberFS: 15,
            FSMultipl: 3,
            WildMultip: 2,
        }

        before("Spin", async() => {
            try {
                let token = await readToken(Useplatform.nameToken);
                const response = await spin(Useplatform.getUrlSpin(), token, id, elbet, lines);
                let { nextActionsSpin, res } = response;
                getLog(res, name, id, i);

                let actionsSpin = res.context.current;
                const winLines = checkWin1(res);
                const winningResult = getWinningResult(winLines);
                const FSResult = await getFSResult(nextActionsSpin, actionsSpin, res);

                data = { res, nextActionsSpin, actionsSpin, winLines, ...winningResult, ...FSResult };

            } catch (error) {
                console.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.error('!!!!!!ERROR in before block!!!!!! ' + error);
            }

        });
        it('Winning Line coordinates from response is correct', () => {
            const { winLinesWithoutScatter } = data;
            CheckWinningLineCoordinates(winLinesWithoutScatter, lines10);

        });
        it('check correct accrual Scatter', () => {
            const { winLinesScatter, actionsSpin, res } = data;
            const { FSMultipl } = peoneerConfig;
            CheckCorrectAccrualScatter(winLinesScatter, actionsSpin, res, paytable, FSMultipl);

        });
        it('check correct position Scatter', () => {
            const { winLinesScatter, res } = data;
            CheckCorrectPositionScatter(winLinesScatter, res);
        });
        it('check correct position of winning symbol', () => {
            const { winLinesWithoutScatter, res } = data;
            CheckCorrectPositionOfWinningSymbol(winLinesWithoutScatter, res);

        });
        it('check correct accrual of winnings', () => {
            const { actionsSpin, res, winLinesWithoutScatter, } = data;
            const { FSMultipl, WildMultip } = peoneerConfig;
            CheckCorrectAccrualOfWinnings(actionsSpin, res, winLinesWithoutScatter, FSMultipl, WildMultip, paytable);

        });
        it('check total amount is correct', () => {
            const { winLines, res } = data;
            CheckTotalAmountIsCorrect(winLines, res);

        });
        it('check correct add count of FS', () => {
            const { actionsSpin, res, FSCount } = data;
            const { numberFS } = peoneerConfig;
            CheckCorrectAddCountOfFS(actionsSpin, res, FSCount, numberFS);

        });
        it('check correct total FS', () => {
            const { actionsSpin, FSCount, globalDate } = data;
            CheckCorrectTotalFS(actionsSpin, globalDate, FSCount);

        });
        it('Check the number of free spins', () => {
            const { actionsSpin, nextActionsSpin, FSCount } = data;
            const { numberFS } = peoneerConfig;
            CheckNumberFS(actionsSpin, nextActionsSpin, FSCount, numberFS);
        });
        it('check rest FS', () => {
            const { actionsSpin, FSCount, globalDate } = data;
            const { numberFS } = peoneerConfig;
            CheckRestFS(actionsSpin, FSCount, globalDate, numberFS);

        });
        it('balance is not change', () => {
            const { actionsSpin, FSCount, res, globalDate } = data;
            BalanceIsNotChange(actionsSpin, FSCount, res, globalDate);

        });
        it('check correct accrual FSWin', function() {
            const { actionsSpin, winLines, res, globalDate } = data;
            CheckCorrectAccrualFSWin(actionsSpin, winLines, res, globalDate);

        });
        it('check correct add FSWin to balance', function() {
            const { actionsSpin, FSCount, globalDate, res } = data;
            CheckCorrectAddFSWinToBalance(actionsSpin, FSCount, globalDate, res);

        });
        it("check type of win 10 Lines", () => {
            let { winLines, res } = data;
            CheckTypeOfWin(winLines, res);

        });
        after("wright", async() => {
            let { FSCount, res, nextActionsSpin } = data;

            if (nextActionsSpin == "freespin" && FSCount.rest > 0) {
                let oldRest = res.context.freespins.count.rest;
                let oldTotal = res.context.freespins.count.total;
                let oldFsWin = res.context.freespins.win;
                let oldBalance = res.user.balance;
                let globalDate = { oldRest, oldTotal, oldFsWin, oldBalance };
                await fs.writeFile('db.json', JSON.stringify(globalDate));
            }
        });
    });
}