import awilix from "awilix";
import { Table } from "sc-game-base";

import { VipSedieWarInGameConsumer, VipSedieWarPlaceBetConsumer } from "./consumers";
import { VipSedieWarBot, VipSedieWarGameCron, VipSedieWarProcessBetQueue } from "./crons";
import { VipSedieWarBetLogs, VipSedieWarBets, VipSedieWarRounds } from "./models";

const { asClass, asValue } = awilix;

export default class SeDieWarContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(VipSedieWarRounds),
            betsRepository: asValue(VipSedieWarBets),
            betLogsRepository: asValue(VipSedieWarBetLogs),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(VipSedieWarPlaceBetConsumer).singleton(),
            inGameConsumer: asClass(VipSedieWarInGameConsumer).singleton(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(VipSedieWarBot).singleton(),
            gameCron: asClass(VipSedieWarGameCron).singleton().proxy(),
            processBetQueue: asClass(VipSedieWarProcessBetQueue).singleton().proxy(),
        });
    }
}
