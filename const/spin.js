// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');

const { serverUrl } = require('../const/list');

chai.use(chaiHttp);

async function spin() {
    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "a687cde0da07ecc1ca07200c9911e40d",
                gameId: 4,
                params: {
                    lines: 10,
                    bet: 60
                },
                action: "spin",
                cheats: "FGABG22IGJDHEHC"
            }),
        });

        let res = await response.json();

        return res;
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}

module.exports = { spin };