import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import { VipSedieWarBot, VipSedieWarGameCron, VipSedieWarProcessBetQueue } from "./crons";
import gameSettings from "./game-settings";
import { VipSedieWarBetLogs, VipSedieWarBets, VipSedieWarRounds } from "./models";
import { calculateSettlementResult, generateResult } from "./result-helpers";
import Startup from "./startup";

const run = async () => {
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);

    const definition = new Core.GameDefinition(
        gameSettings,
        generateResult,
        calculateSettlementResult,
        VipSedieWarRounds,
        VipSedieWarBets,
        VipSedieWarBetLogs
    );

    const gameCron = new VipSedieWarGameCron(definition, gameData, new VipSedieWarBot(definition, gameData));
    const betQueue = new VipSedieWarProcessBetQueue(definition, gameData);
    const startup = new Startup(appConfigs, definition, gameData, gameCron, betQueue);
    const app = new Core.BaseGameApp(appConfigs, definition, gameData, startup);

    await app.run();
};

run();
