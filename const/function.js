const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';
logger.error();

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
    let nameAction = 'spin';
    if (res.context.hasOwnProperty("freespins")) {
        const fsRest = res.context.freespins.count.rest;
        if (fsRest > 0) {
            nameAction = "freespin";
        }
    }

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
            let params = index;
            indexWild.push(params);
            return ExpWild;
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
    const matrix = res.context.matrix;
    console.log(matrix);
    logger.info(matrix);
    const bet = betLines(res);
    const typeCoef = totalWin / bet;
    console.log((typeCoef) + " - typeCoef");
    logger.info(`${typeCoef} - typeCoef`);

    if (typeCoef < 10) {
        return "regular";
    } else if (typeCoef >= 10 && typeCoef < 100) {
        return "big";
    } else if (typeCoef >= 100 && typeCoef < 500) {
        return "ultra";
    } else if (typeCoef >= 500 && typeCoef <= 1500) {
        return "mega";
    }
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
    checkTypeWin
};