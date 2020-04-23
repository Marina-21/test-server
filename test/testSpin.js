// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { paytable } = require('../const/Paytable');
const { PaytableCoef } = require('../const/function');
const { spin } = require('../const/spin');
const { betLines } = require('../const/function');

chai.use(chaiHttp);

for (let i = 0; i < 1; i++) {
    describe.skip('Test spin', async() => {
        try {
            res = await spin();

            expect(res.status.status).to.be.equal(200);
            console.log(res.status.status);


        } catch (error) {
            let { code, message } = res.status;
            // console.log(code + "  code");
            // console.log(message + "  message");
            console.log('!!!!!!ERROR in test block!!!!!! ' + error);
        }
    });
}