import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { calculateSettlementResult, generateResult } from "./result-helpers";
import SeDieWarContainerRegistry from "./sedie-war-container-registry";

const run = async () => {
    const definition = new Core.GameDefinition(gameSettings, generateResult, calculateSettlementResult);
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);

    const container = new SeDieWarContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container, appConfigs);

    await app.run();
    await app.startGame(container);
};

run();
