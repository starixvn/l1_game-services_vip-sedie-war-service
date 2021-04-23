import { userInfos } from "sc-base-database";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

export default class Bot extends Core.Crons.BaseBot {
    constructor(definition, gameData) {
        super(definition, gameData, null);

        this.betChoicesRatio = {
            war: 20,
            handOddEven: 60,
            oddEven: 5,
            tie: 5,
            handOdd: 8,
            handEven: 2,
        };

        this.warChoices = ["player", "banker"];
        this.handOddEvenChoices = ["playerOdd", "playerEven", "bankerOdd", "bankerEven"];
        this.oddEvenChoices = ["odd", "even"];
        this.tieChoice = ["tie"];
        this.handOddChoices = ["playerRed3", "playerWhite3", "bankerRed3", "bankerWhite3"];
        this.handEvenChoices = ["playerRed4", "playerWhite4", "bankerRed4", "bankerWhite4"];

        this.allBets = {};

        this.smallTicketRatio = 70;
        this.smallTickets = 0;

        this.oddTicketRatio = 20;
        this.oddTickets = 0;
    }

    async reset() {
        await super.reset();

        const configs = this.gameData.gameConfigs;

        if (configs?.botenabled) {
            const bots = await userInfos.find({ type: true, disabled: false }, "id name").lean().exec();

            this.bots = this.chance.shuffle(bots).slice(0, this.maxNumberOfBots);
        } else {
            this.bots = [];
        }
    }

    async placeBet(bot) {
        const choice = this.getBetChoice(bot);
        const minBet = this.getMinBet();
        const maxBet = this.getMaxBet(bot, choice);
        const isOddTicket = this.totalTickets === 0 ? false : (this.oddTickets * 100) / this.totalTickets < this.oddTicketRatio;
        const betAmount = this.getBetAmount(minBet, maxBet, isOddTicket);

        if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
            this.gameData.totalBets[choice] = (this.gameData.totalBets[choice] ?? 0) + betAmount;
            this.allBets[choice] = (this.allBets[choice] ?? 0) + betAmount;
            this.totalTickets++;

            if (this.isSmallTicket(betAmount)) {
                this.smallTickets++;
            }

            if (isOddTicket) {
                this.oddTickets++;
            }
        }
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {};
        this.smallTickets = 0;
        this.oddTickets = 0;
    }

    getBetAmount(minBet, maxBet, isOdd) {
        return isOdd ? this.chance.floating({ min: minBet, max: maxBet, fixed: 2 }) : this.chance.integer({ min: minBet, max: maxBet });
    }

    getBetChoice(bot) {
        const totalAllBotsBetAmount = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.warChoices,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.warChoices) * 100) / totalAllBotsBetAmount < this.betChoicesRatio.war,
            },
            {
                group: this.handOddEvenChoices,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.handOddEvenChoices) * 100) / totalAllBotsBetAmount <
                    this.betChoicesRatio.handOddEven,
            },
            {
                group: this.oddEvenChoices,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.oddEvenChoices) * 100) / totalAllBotsBetAmount < this.betChoicesRatio.oddEven,
            },
            {
                group: this.tieChoice,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.tieChoice) * 100) / totalAllBotsBetAmount < this.betChoicesRatio.tie,
            },
            {
                group: this.handOddChoices,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.handOddChoices) * 100) / totalAllBotsBetAmount < this.betChoicesRatio.handOdd,
            },
            {
                group: this.handEvenChoices,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.handEvenChoices) * 100) / totalAllBotsBetAmount < this.betChoicesRatio.handEven,
            },
        ];
        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        return underRatioGroups.length > 0
            ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
            : this.getRandomChoiceFromGroup(this.warChoices);
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;

        const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
        const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3, maxBetPerChoice);

        let maxBet = Math.min(maxBetPerChoice, botMaxBet);

        maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;

        if (this.oddEvenChoices.includes(choice) || this.tieChoice.includes(choice) || this.handOddChoices.includes(choice)) {
            maxBet = isSmallTicket ? maxBetOfSmallTicket : Math.min(maxBetPerChoice, botMaxBet * 0.2);
        }

        if (this.handEvenChoices.includes(choice)) {
            maxBet = Math.min(minBet * 10, botMaxBet * 0.2, maxBetPerChoice);
        }

        return Math.max(minBet, maxBet);
    }

    getRandomChoiceFromGroup(group) {
        const randomIndex = this.chance.natural({ min: 0, max: group.length - 1 });

        return group[randomIndex];
    }

    getTotalAmountOnChoiceGroup(choices) {
        return choices.reduce((totalAmount, choice) => totalAmount + (this.allBets[choice] ?? 0), 0);
    }

    getAllBetAmount() {
        return this.definition.choices.reduce((totalBetAmount, choice) => totalBetAmount + (this.allBets[choice] ?? 0), 0);
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }
}
