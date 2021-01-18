import { Core } from "sc-game-base";

export default class ProcessBetQueue extends Core.Cron.ProcessBetQueue {
    adjustBetTracks(playerName, bet, decrease = false) {
        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];
            const { betChoice, amount } = bet;
            const adjustedAmount = decrease ? -amount : amount;
            const chipAdjustment = decrease ? -1 : 1;

            playerInGame.betTracks[betChoice] = (playerInGame.betTracks[betChoice] ?? 0) + adjustedAmount;

            playerInGame.chips = playerInGame.chips ?? {};
            playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
            playerInGame.chips[betChoice][amount] = (playerInGame.chips[betChoice][amount] ?? 0) + chipAdjustment;
        }
    }

    generatePlacingBetResult(player, balance, bet) {
        const betResult = super.generatePlacingBetResult(player, balance, bet);
        const { betChoice, amount } = bet;

        betResult.ownChip = { betChoice, amount };

        return betResult;
    }
}
