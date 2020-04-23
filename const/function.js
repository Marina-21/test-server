function PaytableCoef(winPositions, paytable, winSymbol) {
    const countSymbol = winPositions.length;
    const coef = paytable[winSymbol];
    const coefCount = coef[countSymbol];
    return coefCount;
};


function betLines(res) {
    let bet = res.context.bet;
    let counLines = res.context.lines;
    return bet / counLines;
};

function winRight() {
    return PaytableCoef(winPositions, paytable, winSymbol) * bet;
};

module.exports = { PaytableCoef, betLines, winRight };