const fs = require('fs').promises;
require('dotenv').config();

const { init } = require('../../const/spinPlatform');
const Platform = require('../../const/Platform');
const listPlatform = require('../../dictionaries/platform');
const listGame = require('../../dictionaries/games.json');
const arrGames = Object.values(listGame);

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheeseTestBet.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger();
logger.level = 'debug';

const platform = listPlatform[process.env.PLATFORM];
const Useplatform = new Platform(platform);
let token;

describe.only('init', () => {

    before("token", async() => {
        try {
            token = await Useplatform.getToken();
            let file = {
                [Useplatform.nameToken]: token
            };
            await fs.writeFile('db1.json', JSON.stringify(file));
            // return (token);
        } catch (error) {
            logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
            logger.info('!!!!!!ERROR in before block!!!!!! ' + error);
        }
    });
    arrGames.forEach((game) => {
        it("Init", async() => {
            try {
                let responce = await init(Useplatform.getUrlInit(), token, parseInt(game.id));
                let { res } = responce;
                console.log(`${game.id}`);
            } catch (error) {
                let { code, message } = error;
                console.log(code + "  code");
                console.log(message + "  message");
                logger.log('!!!!!!ERROR in before block!!!!!! ' + error);
            }
        });
    });
});