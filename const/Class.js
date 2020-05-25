class Platforms {
    constructor(url, token, bets, gamesDate, params) {
        this.url = url;
        this.token = token;
        this.bets = bets;
        this.gamesDate = gamesDate;
        this.params = params;
        gamesDate();
    }
    gamesDate() {
        if (this.params != '') {
            return this.gamesDate.shift(this.params);
        } else {
            return this.gamesDate;
        }
    }
}

let Favorit = new Platforms(
    "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/clien",
    "ceb2175d67eda63301d8a57c4d063adb",
    favoritBets,
    gamesDate,
);

let Gizil = new Platforms(
    "https://cg-gw01.live132.com/v1/client",
    "3fee3225b6403a6a0eaf8d979971cfd7",
    GizilBets,
    gamesDate,
    0
);


let Dev = new Platforms(
    "https://dev-gw01.betslots.cf/v1/client",
    "1c9a4fdb22d9445962da5f8fa7fee023",
    devBets,
    gamesDate
);