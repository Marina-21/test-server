// const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;


const { spin } = require('../../const/spin');


chai.use(chaiHttp);

for (let i = 0; i < 1000; i++) {
    describe.skip('Test spin', function() {
        it("Spin", async() => {
            try {
                const res = await spin();

                expect(res.status.status).to.be.equal(200);
                console.log(res.status.status);
                // console.log(res.context.freespins.count.rest);


            } catch (error) {
                // console.log(code + "  code");
                // console.log(message + "  message");
                console.log('!!!!!!ERROR in test block!!!!!! ' + error);
            }
        });
    });
}