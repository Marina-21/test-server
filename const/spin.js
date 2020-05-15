// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;

const { serverUrl } = require('../const/list');

chai.use(chaiHttp);

let actionSpin;

function chekActionSpin(res) {
    let nameAction = 'spin';
    if (res.context.hasOwnProperty("freespins")) {
        const fsRest = res.context.freespins.count.rest;
        if (fsRest > 0) {
            nameAction = 'freespin';
        }
    }

    return nameAction;
}

async function spin() {
    const data = await fs.readFile('db.txt', 'utf8');
    actionSpin = data;

    try {
        let response = await fetch('https://cg-gw01.live132.com/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "3720debe54f2205e9274459b6d9cbd4d",
                gameId: 12,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: actionSpin,
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

async function spinbeforFS() {
    try {
        let response = await fetch('https://cg-gw01.live132.com/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "3720debe54f2205e9274459b6d9cbd4d",
                gameId: 5,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: "spin"
                    // cheats: "1GABG12IGJDH1HC"
            }),
        });

        let res = await response.json();

        return res;
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);

    }
}

async function freespin() {
    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "805cd546883792db1fabe79440fe440c",
                gameId: 5,
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


module.exports = { spin, spinbeforFS, freespin };