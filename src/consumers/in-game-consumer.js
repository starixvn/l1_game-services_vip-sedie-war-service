import { Core } from "sc-game-base";

export default class InGameConsumer extends Core.BaseEventConsumers.InGameConsumer {
    async consume(realPlayer) {
        const payload = await this.buildPayload(realPlayer);

        realPlayer.socketClient.emit(this.definition.name, payload);
    }

    async buildPayload(realPlayer) {
        const payload = await super.buildPayload(realPlayer);
        const { chips } = this.gameData.ingame[realPlayer.profile.name] || { chips: {} };
        const { remainingTime } = this.gameData;

        return {
            ...payload,
            remainingTime,
            chips,
        };
    }
}
