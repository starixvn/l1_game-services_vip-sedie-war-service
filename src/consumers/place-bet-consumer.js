import { helpers } from "sc-common";
import { Core } from "sc-game-base";

export default class PlaceBetConsumer extends Core.BaseEventConsumers.PlaceBetConsumer {
    composeBettingTimeValidationCriteria() {
        const configs = this.gameData.gameConfigs;
        const shakeThePlateTime = this.definition.durations.placingBets + this.definition.durations.shakeThePlateDuration;

        return [
            {
                failure: !configs.enabled,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
            {
                failure:
                    this.gameData.remainingTime >= this.definition.durations.placingBets &&
                    this.gameData.remainingTime <= shakeThePlateTime,
                notice: this.getNoticeObj(helpers.noticeHelper.cannotPlaceBet),
            },
            {
                failure:
                    this.gameData.remainingTime < this.definition.durations.lockingBet || this.gameData.remainingTime > shakeThePlateTime,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
        ];
    }

    adjustBetTracks(playerName, bet) {
        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];
            const { betChoice, amount } = bet;

            playerInGame.betTracks[betChoice] = (playerInGame.betTracks[betChoice] ?? 0) + amount;

            playerInGame.chips = playerInGame.chips ?? {};
            playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
            playerInGame.chips[betChoice][amount] = (playerInGame.chips[betChoice][amount] ?? 0) + 1;
        }
    }
}
