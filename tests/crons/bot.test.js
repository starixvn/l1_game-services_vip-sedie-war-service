import Chance from "chance";
import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { logger } from "sc-common";
import { Core } from "sc-game-base";
import { BaseBot } from "sc-game-base/src/core/crons";
import { BaseEventPublisher } from "sc-game-base/src/core/event-publishers";

import SedieBot from "../../src/crons/bot";
import gameSettings from "../../src/game-settings";

const definition = new Core.GameDefinition(gameSettings);
const gameData = new Core.GameData(gameSettings.durations.wholeRound);
gameData.gameConfigs = {
    choices_maxbet: getChoiceMaxBet(),
    minbet: 1,
    bot_maxbet: 1000,
};

/** @type {mongoose.Model}*/
const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
/** @type {mongoose.Model}*/
const tempBetsRepository = stubMongooseModelStupidly(mongoose.Model);
const publisher = new BaseEventPublisher(definition.name, gameData);

const chance = new Chance();

describe("SedieBot tests", () => {
    it("all bet amount of choices should be zero after initialize", () => {
        // arrange

        // act
        const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        // assert
        expect(bot.allBets).toBeEmpty();
    });

    it("reset should call super.reset", async () => {
        // arrange
        const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
        spyOn(BaseBot.prototype, "reset");

        // act
        await bot.reset();

        // assert
        expect(BaseBot.prototype.reset).toHaveBeenCalled();
    });

    it("run should call super.run", async () => {
        // arrange
        const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
        spyOn(BaseBot.prototype, "run");

        // act
        await bot.run();

        // assert
        expect(BaseBot.prototype.run).toHaveBeenCalled();
    });

    it("resetAllBotData should call super.resetAllBotData", () => {
        // arrange
        const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
        spyOn(BaseBot.prototype, "resetAllBotData");

        // act
        bot.resetAllBotData();

        // assert
        expect(BaseBot.prototype.resetAllBotData).toHaveBeenCalled();
    });

    it("getAllBetAmount should return sum of bot bet amount", () => {
        // arrange
        const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
        let expected = 0;

        definition.choices.forEach((choice) => {
            const randomAmount = chance.integer();
            bot.allBets[choice] = randomAmount;
            expected += randomAmount;
        });

        // act
        const totalBetAmount = bot.getAllBetAmount();

        // assert
        expect(totalBetAmount).toEqual(expected);
    });

    describe("isSmallTicket test", () => {
        it("should return true if amount less than minBet * smallTicketValueRatio", () => {
            // arrange
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
            const randomAmount = chance.integer({ min: bot.getMinBet(), max: bot.getMinBet() * bot.smallTicketValueRatio - 1 });

            // act
            const result = bot.isSmallTicket(randomAmount);

            // assert
            expect(result).toBeTrue();
        });

        it("should return false if amount greater than minBet * smallTicketValueRatio", () => {
            // arrange
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
            const randomAmount = chance.integer({ min: bot.getMinBet() * bot.smallTicketValueRatio, max: gameData.gameConfigs.bot_maxbet });

            // act
            const result = bot.isSmallTicket(randomAmount);

            // assert
            expect(result).toBeFalse();
        });
    });

    describe("getTotalBetAmount test", () => {
        it("should return correct amount", () => {
            // arrange
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
            const randomAmount = chance.integer({ min: bot.getMinBet(), max: bot.getMinBet() * bot.smallTicketValueRatio - 1 });
            const choice = chance.pickone(bot.handOddEvenChoices);
            const currentBet = {};
            currentBet[choice] = randomAmount;

            // act
            const totalAmount = bot.getTotalBetAmount(currentBet);

            // assert
            expect(totalAmount).toBe(randomAmount);
        });
    });

    describe("getMaxBet", () => {
        it("should return the max value of small ticket if not reach smallTicketRatio", () => {
            // arrange
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository);
            const betChoice = chance.pickone(bot.handOddEvenChoices);

            // act
            const maxBet = bot.getMaxBet(null, betChoice);

            // assert
            expect(maxBet).toEqual(bot.getMinBet() * bot.smallTicketValueRatio);
        });

        it("betChoice belongs handOddEvenChoices should return the lowest-valued between bot_maxbet and choice_maxbet if already passed smallTicketRatio", () => {
            // arrange
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository);
            bot.smallTickets = 1;
            bot.totalTickets = 1;
            const betChoice = chance.pickone(bot.handOddEvenChoices);

            // act
            const maxBet = bot.getMaxBet(null, betChoice);

            // assert
            expect(maxBet).toEqual(gameData.gameConfigs.bot_maxbet);
        });
    });

    describe("placeBet test", () => {
        it("should not place bet in locking time", async () => {
            // arrange
            gameData.remainingTime = chance.integer({ min: 0, max: definition.durations.lockingBet });
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository);
            const botPlayer = { id: "23" };

            // act
            await bot.placeBet(botPlayer);

            // assert
            expect(bot.smallTickets).toEqual(0);
            expect(bot.getAllBetAmount()).toEqual(0);
        });

        it("should be small ticket firstly", async () => {
            // arrange
            gameData.remainingTime = chance.integer({ min: definition.durations.lockingBet + 1, max: definition.durations.placingBets });
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository);
            const botPlayer = { id: "23" };

            // act
            await bot.placeBet(botPlayer);

            // assert
            expect(bot.smallTickets).toEqual(1);
            expect(bot.getAllBetAmount()).toBeGreaterThan(0);
        });

        it("should NOT be small ticket if reached ratio", async () => {
            // arrange
            gameData.remainingTime = chance.integer({ min: definition.durations.lockingBet + 1, max: definition.durations.placingBets });
            const bot = new SedieBot(definition, gameData, publisher, userInfosRepository);
            bot.smallTickets = 1;
            bot.totalTickets = 1;
            const botPlayer = { id: "23" };

            // act
            await bot.placeBet(botPlayer);

            // assert
            expect(bot.smallTickets).toEqual(1);
        });
    });
});

function getChoiceMaxBet() {
    const options = [
        "player",
        "banker",
        "tie",
        "odd",
        "even",
        "playerOdd",
        "playerEven",
        "playerRed3",
        "playerRed4",
        "playerWhite3",
        "playerWhite4",
        "bankerOdd",
        "bankerEven",
        "bankerRed3",
        "bankerRed4",
        "bankerWhite3",
        "bankerWhite4",
    ];

    const choices_maxbet = {};
    options.forEach((option) => {
        choices_maxbet[option] = 2000;
    });

    return choices_maxbet;
}
