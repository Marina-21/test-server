const fetch = require('node-fetch');


class MathModele {
    constructor(nameMathModele) {
        this.name = nameMathModele.name;
        this.paytable = nameMathModele.paytable;
        this.lines = nameMathModele.lines;
        this.numberFS = nameMathModele.numberFS;
        this.FSMultipl = nameMathModele.FSMultipl;
        this.WildMultip = nameMathModele.WildMultip;
    }
}

module.exports = MathModele;