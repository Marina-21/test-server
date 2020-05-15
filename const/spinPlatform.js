// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;




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

async function init(urlInit, token, id) {

    try {
        let response = await fetch(urlInit, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                gameId: id,
            }),
        });
        let res = await response.json();
        actionSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', actionSpin);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}
async function spin(urlSpin, token, id, elbet, lines) {
    const data = await fs.readFile('db.txt', 'utf8');
    actionSpin = data;

    try {
        let response = await fetch(urlSpin, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                gameId: id,
                params: {
                    lines: lines,
                    bet: elbet,
                },
                action: actionSpin
            }),
        });
        let res = await response.json();
        actionSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', actionSpin);

        return { res, actionSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

module.exports = { init, spin };