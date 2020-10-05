const fs = require('fs').promises;
const fetch = require('node-fetch');
const { counter } = require('../global');

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
        let matrixSymbols = res.context.matrix;

        return {
            allWinLines,
            matrixSymbols
        };

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

function chekExpendingWild(matrix) {
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
    console.log(matrix);

    matrix.forEach((el, index) => {
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
    } else {
        return false;
    }
};

let checkTypeWin = function(res) {
    const totalWin = res.context.win.total;
    const bet = betLines(res);
    const typeCoef = totalWin / bet;
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

async function getToken(icmsName, partnerId, cashdeskId, service, userId) {

    try {
        let response = await fetch(`http://icms.${icmsName}.favorit//internal/v2/bg/generateToken`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "partner_id": partnerId,
                "cashdesk_id": cashdeskId,
                "service": service,
                "locale": "ru",
                "user_ip": "195.137.167.34",
                "user_id": userId,
                "game_idt": "betinvest_games_sailor",
                "demo": false,
                "user_country_code": "RU"
            }),
        });
        let res = await response.json();
        let token = res.token;
        return (token);
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

async function checkWild(matrix) {
    let wildInSpin = false;
    let indexWild = [];
    let positionWild = [];
    matrix.forEach((el, index) => {
        let tempSymbol = el.filter(symbol => symbol === '2');
        if (tempSymbol.length > 0) {
            indexWild.push(index);
            positionWild.push({ index, symbol: el });
            wildInSpin = true;
        }
    });
    return { wildInSpin, indexWild, positionWild };
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
    getToken,
    checkWild
};