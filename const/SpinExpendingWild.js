// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;

const { chekActionSpin } = require('../const/function');

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
                token: "805cd546883792db1fabe79440fe440c",
                gameId: 14,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: actionSpin
                    // cheats: "1GABGA2IGJDH1HC"
            }),
        });

        let res = await response.json();
        actionSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', actionSpin);

        return res;
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
                token: "805cd546883792db1fabe79440fe440c",
                gameId: 14,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: "spin",
                cheats: "1GABG1AIGJDH1HC"
            }),
        });

        let res = await response.json();

        return res;
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
                token: "805cd546883792db1fabe79440fe440c",
                gameId: 14,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: "freespin"
            }),
        });

        let res = await response.json();

        return res;
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}


module.exports = { spinEW, spinbeforFSEW, freespinEW };