class Platforms {
    constructor(url, token, bets, gamesDate, params) {
        this.url = url;
        this.token = token;
        this.bets = bets;
        this.gamesDate = gamesDate;
        this.params = params;
    }
    gamesDate() {
        if (this.params != '') {
            return this.gamesDate.shift(this.params);
        } else {
            return this.gamesDate;
        }
    }

}