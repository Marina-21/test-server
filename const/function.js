const fs = require('fs').promises;
const fetch = require('node-fetch');
const { counter } = require('../global');
const listGame = require('../dictionaries/games.json');
const listBet = require('../dictionaries/bet');
const listMathModele = require('../dictionaries/mathModele');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

function PaytableCoef(winPositions, paytable, winSymbol) {
    const countSymbol = winPositions.length;
    const coef = paytable[winSymbol];
    const coefCount = coef[countSymbol];
    return coefCount;
}


function betLines(res) {
    let bet = res.context.bet;
    let counLines = res.context.lines;
    return bet * counLines;
}

function winRight(winPositions, paytable, winSymbol, bet) {
    return PaytableCoef(winPositions, paytable, winSymbol) * bet;
}

const checkWin1 = (res) => {
    if (res.context.hasOwnProperty('win')) {

        const allWinLines = res.context.win.lines;
        return allWinLines;
    } else {
        console.log('spin without win');
        logger.info('spin without win');
        return null;
    }
};

function chekActionSpin(res) {
    // let nameAction = 'spin';
    // if (res.context.hasOwnProperty("freespins")) {
    //     const fsRest = res.context.freespins.count.rest;
    //     if (fsRest > 0) {
    //         nameAction = "freespin";
    //     }
    // }

    //     return nameAction;
    let nameAction = res.context.actions;
    return nameAction;
}

function chekExpendingWild(UseMathModele, res) {
    if (UseMathModele.name === "EW") {
        const newMatrix = [];
        let ExpWild = false;
        let indexWild = [];
        // let matrixTest = [
        //     ["1", "B", "A"],
        //     ["1", "2", "A"],
        //     ["A", "1", "A"],
        //     ["A", "B", "A"],
        //     ["A", "B", "A"],
        // ];

        res.context.matrix.forEach((el, index) => {
            let tempSymbol = el.filter(symbol => symbol != 2);
            if (tempSymbol.length < 3) {
                newMatrix.push(["2", "2", "2"]);
                console.log(tempSymbol);
                ExpWild = true;
                indexWild.push(index);
            } else {
                newMatrix.push(el);
            }
        });
        console.log(newMatrix);
        return { newMatrix, ExpWild, indexWild };
    }
}

let checkError = function(res, urlSpin) {
    if (res.status.ok == false) {
        let { ok, message, code } = res.status;
        throw new Error(`Could not fetch ${urlSpin}, 
    status: ${ok},
    message: ${message}, 
    code: ${code}`);
    }
};

let checkSymbolMultiplier = function(winSymbol) {
    let symbolB = winSymbol.includes("B");
    let symbolC = winSymbol.includes("C");
    let symbolD = winSymbol.includes("D");
    let symbolE = winSymbol.includes("E");
    if (symbolB || symbolC || symbolD || symbolE) {
        return true;
    }
};

let checkTypeWin = function(res, typeWin) {
    const bet = betLines(res);

    let typeCoef;
    if (typeWin === 'win') {
        typeCoef = (res.context[typeWin].total) / bet;
    } else {
        typeCoef = (res.context[typeWin].win.total) / bet;
    }
    console.log((typeCoef) + " - typeCoef");
    logger.info(`${typeCoef} - typeCoef`);

    if (typeCoef < 5) {
        return "regular";
    } else if (typeCoef >= 5 && typeCoef < 10) {
        return "big";
    } else if (typeCoef >= 10 && typeCoef < 50) {
        return "ultra";
    } else if (typeCoef >= 50 && typeCoef <= 1500) {
        return "mega";
    }
};

async function readToken(nameToken) {
    const file = await fs.readFile('db1.json', 'utf8');
    const obj = JSON.parse(file);
    let token = obj[nameToken];
    return (token);
}


function getGame(gameName, Useplatform) {
    const arrGames = Object.values(listGame);
    const indexGame = arrGames.findIndex((el) => { return el.name === gameName; });
    console.log(indexGame);
    const { name, mathModele } = arrGames[indexGame];
    const id = parseInt(arrGames[indexGame].id);
    const lines = parseInt(arrGames[indexGame].lines);
    const useBet = arrGames[indexGame][Useplatform.bet];
    const elbet = parseInt(listBet[useBet][7]);
    // const gameMathModele = listMathModele[nameMathModele];
    return {
        name,
        id,
        lines,
        elbet,
        mathModele
    };
}


module.exports = {
    PaytableCoef,
    betLines,
    winRight,
    checkWin1,
    chekActionSpin,
    chekExpendingWild,
    checkError,
    checkSymbolMultiplier,
    checkTypeWin,
    readToken,
    getGame,
};