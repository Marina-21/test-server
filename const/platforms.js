let FavoritSpin = {
    urlSpin: "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/spin",
    token: "ceb2175d67eda63301d8a57c4d063adb"
};
let FavoritInit = {
    urlInit: "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/init",
    token: "ceb2175d67eda63301d8a57c4d063adb"
};
let GizilSpin = {
    urlSpin: "https://cg-gw01.live132.com/v1/client/spin",
    token: "3fee3225b6403a6a0eaf8d979971cfd7"
};
let GizilInit = {
    urlInit: "https://cg-gw01.live132.com/v1/client/init",
    tokrn: "3fee3225b6403a6a0eaf8d979971cfd7"
};
let DevSpin = {
    urlSpin: "https://dev-gw01.betslots.cf/v1/client/spin",
    token: "1c9a4fdb22d9445962da5f8fa7fee023"
};
let DevInit = {
    urlInit: "https://dev-gw01.betslots.cf/v1/client/init",
    token: "1c9a4fdb22d9445962da5f8fa7fee023"
};

let favoritBets = [
    5,
    10,
    20,
    30,
    50,
    70,
    100,
    150,
    250,
    500,
    750,
    1000,
    2000,
    5000
];

let gamesDate = [{
        name: "football",
        id: 1,
        lines: 10

    },
    {
        name: "neon",
        id: 2,
        lines: 10
    },
    {
        name: "dzen",
        id: 3,
        lines: 10

    },
    {
        name: "halloween",
        id: 4,
        lines: 10
    },
    {
        name: "food",
        id: 5,
        lines: 10
    },
    {
        name: "pixelact",
        id: 6,
        lines: 10
    },
    {
        name: "steam",
        id: 8,
        lines: 10
    },
    {
        name: "viking",
        id: 9,
        lines: 10
    },
    {
        name: "fruit3",
        id: 10,
        lines: 5
    },
    {
        name: "fruit5",
        id: 11,
        lines: 10
    },
    {
        name: "covid",
        id: 12,
        lines: 10
    },
    {
        name: "volcan",
        id: 14,
        lines: 20
    }

];

let devBets = [
    2,
    4,
    6,
    8,
    10,
    12,
    16,
    20,
    40,
    60,
    80,
    100,
    200,
    400,
    600,
    800,
    1000
];
let GizilBets = [
    6,
    8,
    10,
    12,
    16,
    20,
    40,
    60,
    80,
    100,
    200,
    400,
    600,
    800,
    1000
];

class Platforms {
    constructor(urlSpin, urlInit, token, bets, gamesDate, params) {
            this.urlSpin = urlSpin;
            this.urlInit = urlInit;
            this.token = token;
            this.bets = bets;
            this.gamesDate = gamesDate;
            this.params = params;

        }
        // gamesDate() {
        //     if (this.params != '') {
        //         return this.games.shift(this.params);
        //     } else {
        //         return this.games;
        //     }
        // }
}

let Favorit = new Platforms(
    "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/clien/spin",
    "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/clien/init",
    "ceb2175d67eda63301d8a57c4d063adb",
    favoritBets,
    gamesDate,
);

let Gizil = new Platforms(
    "https://cg-gw01.live132.com/v1/client/spin",
    "https://cg-gw01.live132.com/v1/client/init",
    "3fee3225b6403a6a0eaf8d979971cfd7",
    GizilBets,
    gamesDate,
    0
);


let Dev = new Platforms(
    "https://dev-gw01.betslots.cf/v1/client/spin",
    "https://dev-gw01.betslots.cf/v1/client/init",
    "1c9a4fdb22d9445962da5f8fa7fee023",
    devBets,
    gamesDate
);


module.exports = {
    favoritBets,
    gamesDate,
    devBets,
    FavoritSpin,
    FavoritInit,
    GizilSpin,
    GizilInit,
    DevSpin,
    DevInit,
    GizilBets,
    Favorit,
    Gizil,
    Dev
};