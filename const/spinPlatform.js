// const mocha = require('mocha');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fetch = require('node-fetch');
const fs = require('fs').promises;

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';


const { checkError } = require('../const/function');

chai.use(chaiHttp);

let nextActionsSpin;

function chekActionSpin(res) {
    // let nameAction = 'spin';
    // if (res.context.hasOwnProperty("freespins")) {
    //     const fsRest = res.context.freespins.count.rest;
    //     if (fsRest > 0) {
    //         nameAction = 'freespin';
    //     }
    // }

    // return nameAction;
    let [nextActionsSpin] = res.context.actions;
    return nextActionsSpin;
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

        // checkError(res);

        nextActionsSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', nextActionsSpin);

        return { res, nextActionsSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}
async function spin(urlSpin, token, id, elbet, lines) {
    // https://www.betinvest.ptst/bigames/cg-gw01/v1/client/spin
    const data = await fs.readFile('db.txt', 'utf8');
    const actionsSpin = data;

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
                action: actionsSpin
                    // cheats: "1ADAACAFCAIAD1A"
            }),
        });

        let res = await response.json();

        // let [matrix, actions, win] = res.context;

        // console.log(res, res.context.matrix, res.context.actions, res.context.win);
        // logger.info(res, res.context.matrix, res.context.actions, res.context.win);
        checkError(res);

        nextActionsSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', nextActionsSpin);

        return { res, nextActionsSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

async function spinbeforeFS(urlSpin, token, id, lines, elbet, cheat) {
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
                    bet: elbet
                },
                action: "spin",
                cheats: cheat
            }),
        });

        let res = await response.json();

        checkError(res);


        nextActionsSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', nextActionsSpin);

        return { res, nextActionsSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

async function freespin(urlSpin, token, id, lines, elbet, cheat) {
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
                    bet: elbet
                },
                action: "freespin",
                cheats: cheat
            }),
        });

        let res = await response.json();

        checkError(res);

        nextActionsSpin = chekActionSpin(res);

        await fs.writeFile('db.txt', nextActionsSpin);

        return { res, nextActionsSpin };
    } catch (err) {
        console.log('!!!!!!ERROR!!!!!! ' + err);
    }
}

module.exports = { init, spin, spinbeforFS: spinbeforeFS, freespin };