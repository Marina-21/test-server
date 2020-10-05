const fetch = require('node-fetch');
let favoritBets = [
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
let devBets = [
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

let betCircusUkr = [
    5,
    6,
    10,
    14,
    20,
    30,
    50,
    100,
    150,
    200,
    400,
    1000
];

let betCircusTR = [
    1,
    2,
    3,
    4,
    5,
    7,
    8,
    10,
    15,
    20,
    40,
    80,
    100,
    150,
    200
];
let betFruit3 = [
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
let betSailor = [
    15,
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
let betCrazyHotUk = [
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
    5000,
    10000,
    15000
];
let betCrazyHotTR = [
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
let betSailor30TR = [
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
    400
];
let betSailor30UK = [
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
    2000
];

let betCrazyHot5UK = [
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
    5000,
    10000
]

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

let OMGBet = [
    100,
    150,
    250,
    500,
    750,
    1000,
    2000,
    5000
];

let betPearlUkr = [
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
]
let gamesDate = [{
        name: "football",
        id: 1,
        lines: 10,
        number: 0,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "neon",
        id: 2,
        lines: 10,
        number: 1,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "dzen",
        id: 3,
        lines: 10,
        number: 2,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "halloween",
        id: 4,
        lines: 10,
        number: 3,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "food",
        id: 5,
        lines: 10,
        number: 4,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "pixelact",
        id: 6,
        lines: 10,
        number: 5,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "steam",
        id: 8,
        lines: 10,
        number: 6,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "viking",
        id: 9,
        lines: 10,
        number: 7,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "fruit3",
        id: 10,
        lines: 5,
        number: 8,
        betUkr: betFruit3,
        betTR: GizilBets
    },
    {
        name: "fruit5",
        id: 11,
        lines: 10,
        number: 9,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "covid",
        id: 12,
        lines: 10,
        number: 10,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "volcan",
        id: 14,
        lines: 20,
        number: 11,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "Sailor",
        id: 15,
        lines: 10,
        number: 12,
        bets: betSailor,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "circus",
        id: 18,
        lines: 50,
        number: 13,
        betUkr: betCircusUkr,
        betTR: betCircusTR
    },
    {
        name: "CrazyHot30",
        id: 19,
        lines: 30,
        number: 14,
        betUkr: betCrazyHotUk,
        betTR: betCrazyHotTR
    },
    {
        name: "sailor20",
        id: 17,
        lines: 20,
        number: 15,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "Pearl",
        id: 16,
        lines: 10,
        number: 16,
        betUkr: betPearlUkr,
        betTR: GizilBets
    },
    {
        name: "sailor30",
        id: 20,
        lines: 30,
        number: 17,
        betUkr: betSailor30UK,
        betTR: betSailor30TR
    },
    {
        name: "CrazyHot5",
        id: 21,
        lines: 5,
        number: 18,
        betUkr: betCrazyHot5UK,
        betTR: betCrazyHotTR
    },
    {
        name: "Pearl20",
        id: 22,
        lines: 20,
        number: 19,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "crazy20",
        id: 23,
        lines: 20,
        number: 20,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "football20",
        id: 24,
        lines: 20,
        number: 21,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "clover",
        id: 26,
        lines: 20,
        number: 22,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "kavun",
        id: 27,
        lines: 5,
        number: 23,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "book",
        id: 25,
        lines: 10,
        number: 24,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "aztec",
        id: 28,
        lines: 20,
        number: 25,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "osiris",
        id: 29,
        lines: 20,
        number: 26,
        betUkr: favoritBets,
        betTR: GizilBets
    },
    {
        name: "halloween20",
        id: 31,
        lines: 20,
        number: 27,
        betUkr: favoritBets,
        betTR: GizilBets,
        betOMG: OMGBet
    },
    {
        name: "fever",
        id: 30,
        lines: 30,
        number: 28,
        betUkr: favoritBets,
        betTR: GizilBets,
        betOMG: OMGBet
    }
];

// let gamesDateGizil = gamesDate.shift();



class Platforms {
    constructor(urlSpin, urlInit, gamesDate, bet, name, icms, pId, cId, serviceName, usId) {
        this.urlSpin = urlSpin;
        this.urlInit = urlInit;
        this.gamesDate = gamesDate;
        this.bet = bet;
        this.nameToken = name;
        this.icmsName = icms;
        this.partnerId = pId;
        this.cashdeskId = cId;
        this.service = serviceName;
        this.userId = usId;
    }
    async getToken() {

        try {
            let response = await fetch(`http://icms.${this.icmsName}.favorit//internal/v2/bg/generateToken`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "partner_id": this.partnerId,
                    "cashdesk_id": this.cashdeskId,
                    "service": this.service,
                    "locale": "ru",
                    "user_ip": "195.137.167.34",
                    "user_id": this.userId,
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
}


let Favorit = new Platforms(
    "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/spin",
    "https://www.favorit.com.ua/bigames/cg-gw01/v1/client/init",
    gamesDate,
    'betUkr',
    'favoritToken',
    "ihub",
    "1",
    "-5",
    "crazyguysgames",
    "3901363"
);

let Gizil = new Platforms(
    "https://cg-gw01.live132.com/v1/client/spin",
    "https://cg-gw01.live132.com/v1/client/init",
    gamesDate,
    'betTR',
    'gizilToken',
    "tm1",
    "34",
    "-53",
    "crazyguysgames",
    "25412"
);


let Dev = new Platforms(
    "https://www.betinvest.ptst/bigames/cg-gw01/v1/client/spin",
    "https://www.betinvest.ptst/bigames/cg-gw01/v1/client/init",
    gamesDate,
    'betUkr',
    'devToken',
    "ptst",
    '15',
    "-16",
    "betinvestgame",
    "1454362"

);

let OMG = new Platforms(
    "https://omg.bet/bigames/cg-gw01/v1/client/spin",
    "https://omg.bet/bigames/cg-gw01/v1/client/init",
    gamesDate,
    'betOMG',
    'omgToken',
    "ua5",
    "30136",
    "-60",
    "crazyguysgames",
    "3082344"
);

let Favoritsport = new Platforms(
    "https://www.favoritsport.info/bigames/cg-gw01/v1/client/spin",
    "https://www.favoritsport.info/bigames/cg-gw01/v1/client/init",
    gamesDate,
    'betUkr',
    'infoToken',
    "en2",
    "91",
    "-135",
    "betinvestgame",
    "140"
);
let FavBet = new Platforms(
    "https://www.favbet.com/bigames/cg-gw01/v1/client/spin",
    "https://www.favbet.com/bigames/cg-gw01/v1/client/init",
    gamesDate,
    'betUkr',
    'fabBet'
);


module.exports = {
    favoritBets,
    gamesDate,
    devBets,
    GizilBets,
    Favorit,
    Gizil,
    Dev,
    OMG,
    Favoritsport,
    FavBet
};