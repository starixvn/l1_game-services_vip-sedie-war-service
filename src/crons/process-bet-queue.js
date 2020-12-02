import { Core } from "sc-game-base";

export default class VipSedieWarProcessBetQueue extends Core.Cron.ProcessBetQueue {
    adjustBetTracks(playerName, bet) {
        const { betChoice, amount } = bet;

        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];

            playerInGame.betTracks[betChoice] = (playerInGame.betTracks[betChoice] ?? 0) + amount;

            playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
            playerInGame.chips[betChoice][amount] = (playerInGame.chips[betChoice][amount] ?? 0) + 1;
        }
    }

    generatePlacingBetResult(player, balance, bet) {
        const betResult = super.generatePlacingBetResult(player, balance, bet);
        const { betChoice, amount } = bet;

        betResult.ownChip = { betChoice, amount };

        return betResult;
    }
}
