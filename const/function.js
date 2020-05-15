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

function winRight() {
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

module.exports = { PaytableCoef, betLines, winRight, checkWin1, chekActionSpin, chekExpendingWild };