const fetch = require('node-fetch');

class Platform {
    constructor(platform) {
        this.url = platform.url;
        this.nameToken = platform.nameToken;
        this.bet = platform.bet;
        this.icmsName = platform.icmsName;
        this.partnerId = platform.partnerId;
        this.cashdeskId = platform.cashdeskId;
        this.service = platform.service;
        this.userId = platform.userId;
    }
    getUrlInit() {
        return (this.urlInit = `${this.url}init`);
    }
    getUrlSpin() {
        return (this.urlSpin = `${this.url}spin`);
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
module.exports = Platform;