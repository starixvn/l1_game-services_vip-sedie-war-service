import { Core } from "sc-game-base";

export default class ProcessBetQueue extends Core.Crons.ProcessBetQueue {
    decreaseBetTracks(playerName, bet) {
        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];
            const { betChoice, amount } = bet;

            playerInGame.betTracks[betChoice] -= amount;

            playerInGame.chips = playerInGame.chips ?? {};
            playerInGame.chips[betChoice] = playerInGame.chips[betChoice] ?? {};
            playerInGame.chips[betChoice][amount] -= 1;
        }
    }

    generatePlacingBetResult(player, balance, bet) {
        const betResult = super.generatePlacingBetResult(player, balance, bet);
        const { betChoice, amount } = bet;

        betResult.ownChip = { betChoice, amount };

        return betResult;
    }
}
