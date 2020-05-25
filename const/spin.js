// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;

const { checkError } = require('../const/function');

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
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 1,
                params: {
                    lines: 10,
                    bet: 20
                },
                action: actionSpin,
                // cheats: "1GABGA2IGJDH1HC"
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

async function spinbeforFS() {
    try {
        let response = await fetch('https://dev-gw01.betslots.cf/v1/client/spin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 1,
                params: {
                    lines: 10,
                    bet: 200
                },
                action: "spin",
                cheats: "1GABG12IGJDH1HC"
            }),
        });

        let res = await response.json();
        actionSpin = chekActionSpin(res);

        checkError(res);

        return { res, actionSpin };
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
                token: "1c9a4fdb22d9445962da5f8fa7fee023",
                gameId: 1,
                params: {
                    lines: 10,
                    bet: 200
                },
                action: "freespin"
            }),
        });

        let res = await response.json();
        actionSpin = chekActionSpin(res);

        checkError(res);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}


module.exports = { spin, spinbeforFS, freespin };