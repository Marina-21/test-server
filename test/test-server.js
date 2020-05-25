const chai = require('chai');
const chaiHttp = require('chai-http');
const { serverUrl } = require('../const/list');

const expect = chai.expect;

chai.use(chaiHttp);

describe.skip('Test server', () => {
    it('Init', async(done) => {
        const route = '/init';

        const params = {
            token: "f7aad3f8cbd8e21754f71e78f7f53c7a",
            gameId: 4
        };

        chai.request(serverUrl)
            .post(route)
            .set('content-type', 'application/json')
            .send(JSON.stringify(params))
            .end((err, res) => {
                if (err) {
                    console.log('Errors! ' + err);
                    done(err);
                }
                const body = JSON.parse(res.text);
                expect(res.status).to.be.equal(200);
                expect(body.settings.bets[0]).to.be.equal(20);
                // console.log(body);

                done();
            });
    });
});