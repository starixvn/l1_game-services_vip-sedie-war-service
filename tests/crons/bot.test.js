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
    choices_maxbet: {
        even: 2000,
        odd: 2000,
        red3: 1000,
        white3: 1000,
        red4: 100,
        white4: 100,
        red2: 2000,
    },
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
});
