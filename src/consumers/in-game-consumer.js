import { Core } from "sc-game-base";

export default class InGameConsumer extends Core.BaseEventConsumers.InGameConsumer {
    async buildPayload(realPlayer) {
        const payload = super.buildPayload(realPlayer);
        const { chips } = this.gameData.ingame[realPlayer.profile.name] || { chips: {} };
        const { remainingTime } = this.gameData;

        return {
            ...payload,
            remainingTime,
            chips,
        };
    }
}
