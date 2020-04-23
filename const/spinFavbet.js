// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');



chai.use(chaiHttp);

async function spinFavbet() {
    try {
        let response = await fetch('https://www.favorit.com.ua/bigames/cg-gw01/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "ac5f3ef1b3662f467bb07bd92f77e05f",
                gameId: 4,
                params: {
                    lines: 10,
                    bet: 100,
                },
                action: "spin"
            }),
        });

        let res = await response.json();

        return res;
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

module.exports = { spinFavbet };