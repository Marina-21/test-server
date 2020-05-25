// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;

const { chekActionSpin } = require('../const/function');
const { checkError } = require('../const/function');

chai.use(chaiHttp);

let actionSpin;



async function spinEW() {
    const data = await fs.readFile('db.txt', 'utf8');
    actionSpin = data;

    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 14,
                params: {
                    lines: 20,
                    bet: 200
                },
                action: actionSpin
                    // cheats: "FG1CHIGIFEGAHJJ"
            }),
        });

        let res = await response.json();

        checkError(res);

        actionSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', actionSpin);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}
async function spinbeforFSEW() {
    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 14,
                params: {
                    lines: 20,
                    bet: 200
                },
                action: "spin",
                cheats: "11ABGBAIGJDH1H1"
            }),
        });

        let res = await response.json();

        checkError(res);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}
async function freespinEW() {
    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 14,
                params: {
                    lines: 20,
                    bet: 200
                },
                action: "freespin"
            }),
        });

        let res = await response.json();

        checkError(res);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}


module.exports = { spinEW, spinbeforFSEW, freespinEW };