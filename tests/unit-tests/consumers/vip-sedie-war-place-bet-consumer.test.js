import Chance from "chance";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

import VipSeDieWarPlaceBetConsumer from "../../../src/consumers/vip-sedie-war-place-bet-consumer";
import gameSetting from "../../../src/game-settings";

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

    return gameData;
};

const mockBetPayload = (choice, amount, roundId = 1) => {
    return {
        amount: amount,
        betChoice: choice,
        roundId,
    };
};

describe("composeBettingTimeValidationCriteria tests", () => {
    const chance = new Chance();
    const gameData = mockGameData();
    const gameDefinition = new Core.GameDefinition(gameSetting);

    beforeEach(() => {
        gameData.remainingTime = 20;
        gameData.gameConfigs.enabled = true;
    });

    it("should return placeBetNextRound notice if game was disabled", () => {
        // arrange
        gameData.gameConfigs.enabled = false;
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria();

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should return cannotPlaceBet notice if bet comes in settlement time", () => {
        // arrange
        gameData.remainingTime = chance.integer({
            min: gameDefinition.durations.placingBets,
            max: gameDefinition.durations.placingBets + gameDefinition.durations.shakeThePlateDuration,
        });
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria();

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.cannotPlaceBet },
        });
    });

    it("should return placeBetNextRound notice if bet comes in locking bet time", () => {
        // arrange
        gameData.remainingTime = chance.integer({
            min: 0,
            max: gameDefinition.durations.lockingBet - 1,
        });
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria();

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should return placeBetNextRound notice if bet comes in shaking plate time", () => {
        // arrange
        gameData.remainingTime = chance.integer({
            min: gameDefinition.durations.placingBets + gameDefinition.durations.shakeThePlateDuration + 1,
            max: gameDefinition.durations.wholeRound,
        });
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria();

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should not return any failures if valid", () => {
        // arrange
        gameData.remainingTime = chance.integer({
            min: gameDefinition.durations.lockingBet + 1,
            max: gameDefinition.durations.placingBets,
        });
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria();

        // assert
        expect(criterions.filter((x) => x.failure)).toBeEmpty();
    });
});

describe("adjustBetTracks tests", () => {
    const playerName = "playerName";
    const chance = new Chance();
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

    it("should increase betTrack and chips of choice properly", () => {
        // arrange
        const choice = chance.pickone(gameSetting.choices);
        const amount = chance.integer();
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        placeBetConsumer.adjustBetTracks(playerName, mockBetPayload(choice, amount));

        // assert
        expect(gameData.ingame[playerName].betTracks[choice]).toEqual(amount);
        expect(gameData.ingame[playerName].chips[choice][amount]).toEqual(1);
    });

    it("should increase betTrack and chips  of choice properly when has existing bet", () => {
        // arrange
        const choice = chance.pickone(gameSetting.choices);
        const amount = chance.integer();
        gameData.ingame[playerName].betTracks[choice] = amount;
        gameData.ingame[playerName].chips[choice] = {};
        gameData.ingame[playerName].chips[choice][amount] = 1;
        const placeBetConsumer = new VipSeDieWarPlaceBetConsumer(gameDefinition, gameData);

        // act
        placeBetConsumer.adjustBetTracks(playerName, mockBetPayload(choice, amount));

        // assert
        expect(gameData.ingame[playerName].betTracks[choice]).toEqual(amount * 2);
        expect(gameData.ingame[playerName].chips[choice][amount]).toEqual(2);
    });
});
