import { Core } from "sc-game-base";

export default class VipSedieWarGameCron extends Core.Cron.BaseGameCron {
    isStartingTime(remainingTime, durations) {
        return remainingTime === durations.placingBets + durations.shakeThePlateDuration;
    }
}
