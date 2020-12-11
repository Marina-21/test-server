interface IPlatform {
    url: string;
    nameToken: string;
    bet: string;
    icmsName: string;
    partnerId: string;
    cashdeskId: string;
    service: string;
    userId: string; 
}

interface IResToken {
    status: boolean,
    message: string,
    data_version: string,
    request_id: string,
    context: {
        partner_id: number,
        cashdesk_id: number,
        service: string,
        locale: string,
        user_ip: string,
        user_id: number,
        game_idt: string,
        demo: boolean,
        user_country_code: string
    }
    token: string,
    host: string,
    code: number
}

class Platform {
    platform: IPlatform; 
    url: string;
    nameToken: string;
    bet: string;
    icmsName: string;
    partnerId: string;
    cashdeskId: string;
    service: string;
    userId: string;
    urlInit: string;
    urlSpin: string;
    res: IResToken;
    token: string
    constructor(platform: IPlatform) {
        this.url = platform.url;
        this.nameToken = platform.nameToken;
        this.bet = platform.bet;
        this.icmsName = platform.icmsName;
        this.partnerId = platform.partnerId;
        this.cashdeskId = platform.cashdeskId;
        this.service = platform.service;
        this.userId = platform.userId;
    }
    getUrlInit(): string {
        return (this.urlInit  = `${this.url}init`);
    }
    getUrlSpin(): string {
        return (this.urlSpin = `${this.url}spin`);
    }
    getToken = async (): Promise<string | undefined>  => {
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