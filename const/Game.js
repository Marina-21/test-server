const fetch = require('node-fetch');
const listBet = require('../dictionaries/bet');
const listMathModele = require('../dictionaries/mathModele');

class Game {
    constructor(game) {
        this.name = game.name;
        this.id = game.id;
        this.lines = game.lines;
        this.number = game.number;
        this.betUkr = game.betUkr;
        this.betTR = game.betTR;
        this.betOMG = game.betOMG;
        this.nameMathModele = game.nameMathModele;
    }
    getBet(Useplatform) {
        this.useBet = this[Useplatform.bet];
        return (this.elbet = parseInt(listBet[this.useBet][7]));
    }
    // getMathModele() {
    //     return (this.UseMathModele = listMathModele[this.nameMathModele]);
    // }
    getId() {
        return (parseInt(this.id));
    }
    getLines() {
        return (parseInt(this.lines));
    }
}
module.exports = Game;