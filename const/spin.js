const mocha = require('mocha');
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
                token: "f7aad3f8cbd8e21754f71e78f7f53c7a",
                gameId: 4,
                params: {
                    lines: 10,
                    bet: 60
                },
                action: "spin",
                // cheats: "FGABG22IGJDHEHC"
            }),
        });

        let res = await response.json();

        return res;
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
        let res = await response.json();
        console.log(res)
        let { code, message } = res.status;
        console.log(code + "  code");
        console.log(message + "  message");

    }
};

module.exports = { spin };