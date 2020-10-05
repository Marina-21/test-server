const fs = require('fs').promises;
require('dotenv').config();


const { Favorit, Gizil, Dev, OMG, Favoritsport, FavBet } = require('../../const/platforms');
const { init } = require('../../const/spinPlatform');
const { getToken } = require('../../const/function');

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

const platform = {
    Favorit: Favorit,
    Gizil: Gizil,
    Dev: Dev,
    OMG: OMG,
    Favoritsport: Favoritsport,
    FavBet: FavBet
};
let usePlatform = platform[process.env.PLATFORM];
let { urlInit, gamesDate, nameToken } = usePlatform;
let token;

describe.only('init', () => {

    before("token", async() => {
        try {
            token = await usePlatform.getToken();
            let file = {
                [nameToken]: token
            };
            await fs.writeFile('db1.json', JSON.stringify(file));
            // return (token);
        } catch (error) {
            logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
            logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
        }
    });
    gamesDate.forEach((el) => {
        it("Init", async() => {
            try {
                let id = el.id;
                let responce = await init(urlInit, token, id);
                let { res } = responce;
                logger.info(res);


                logger.info("Type of win is correct");
                console.log(`${responce} - ${id}`);

            } catch (error) {
                let { code, message } = error;
                console.log(code + "  code");
                console.log(message + "  message");
                logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
                logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
    });
});