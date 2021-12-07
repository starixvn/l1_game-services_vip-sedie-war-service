import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core } from "sc-game-base";

import { VipSedieWarInGameConsumer } from "../../src/consumers";
import gameSetting from "../../src/game-settings";

const mockGameData = () => {
    const gameData = new Core.GameData();
    gameData.remainingTime = 20;
    gameData.gameConfigs = {
        enabled: true,
        minbet: 1,
        maxbet: 1000,
        choices_maxbet: {
            choice01: 200,
        },
    };
    gameData.exchangeRates = {
        exId: 1,
        code: {
            USD: 1,
            VND: 0.00004405,
            IDR: 0.07099,
        },
    };

    return gameData;
};

/** @type {mongoose.Model}*/
const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
const roundQuery = stub(Core.QueryApis.RoundQuery);
const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);
const getBalance = jest.fn();
const playerName = "player01";
const realPlayer = {
    socketClient: {
        emit: jest.fn(),
    },
    profile: {
        name: playerName,
    },
    session: {
        currencyCode: "USD",
        multiplier: 1,
        currencyGroupId: 1,
    },
};

describe("buildPayload tests", () => {
    const gameData = mockGameData();
    const gameDefinition = new Core.GameDefinition(gameSetting);

    beforeEach(() => {
        gameData.ingame = {
            [playerName]: {
                name: playerName,
                betTracks: {},
                betQueue: [],
                chips: {},
            },
        };
    });

    it("should return payload with correct remainingTime", async () => {
        // arrange
        const inGameConsumer = new VipSedieWarInGameConsumer(
            gameDefinition,
            gameData,
            roundQuery,
            publisher,
            getBalance,
            userInfosRepository
        );

        // act
        var payload = await inGameConsumer.buildPayload(realPlayer);

        // assert
        expect(payload.remainingTime).toEqual(gameData.remainingTime);
    });

    it("should return payload with correct chips of player", async () => {
        // arrange
        const choice = "player";
        const amount = 50;
        gameData.ingame[playerName].chips[choice] = {};
        gameData.ingame[playerName].chips[choice][amount] = 1;
        const inGameConsumer = new VipSedieWarInGameConsumer(
            gameDefinition,
            gameData,
            roundQuery,
            publisher,
            getBalance,
            userInfosRepository
        );

        // act
        var payload = await inGameConsumer.buildPayload(realPlayer);

        // assert
        expect(payload.chips).not.toBeEmpty();
        expect(payload.chips[choice][amount]).toEqual(1);
    });
});
