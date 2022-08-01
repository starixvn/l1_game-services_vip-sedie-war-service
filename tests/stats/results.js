import { calculateSettlementResult, generateResult } from "../../src/result-helpers";

const streakNumber = 4;
const longestStreak = 4;
const choiceGroups = {
    "1x2": ["player", "tie", "banker"],
    oe: ["odd", "even"],
    playerOE: ["playerOdd", "playerEven"],
    bankerOE: ["bankerOdd", "bankerEven"],
};

function createStreakCount() {
    return {
        player: 0,
        banker: 0,
        tie: 0,
        odd: 0,
        even: 0,
        playerOdd: 0,
        playerEven: 0,
        bankerOdd: 0,
        bankerEven: 0,
    };
}

function calculateStreaks(stats, settlementResult, occurrences, streaks, k) {
    stats[k] += settlementResult[k] ? 1 : 0;

    Object.values(choiceGroups).forEach((group) => {
        if (!group.includes(k)) {
            return;
        }

        let c = settlementResult[k] ? occurrences[k] + 1 : 0;
        if (c >= streakNumber) {
            streaks.total++;
            streaks[k]++;
        }

        if (c >= longestStreak) {
            c = 0;
        }

        occurrences[k] = c;
    });
}

function run(randomMode) {
    const totalRounds = 100_000;

    const stats = {
        player: 0,
        banker: 0,
        tie: 0,
        odd: 0,
        even: 0,
        playerOdd: 0,
        playerEven: 0,
        playerRed3: 0,
        playerRed4: 0,
        playerWhite3: 0,
        playerWhite4: 0,
        bankerOdd: 0,
        bankerEven: 0,
        bankerRed3: 0,
        bankerRed4: 0,
        bankerWhite3: 0,
        bankerWhite4: 0,
    };

    const streaks = { total: 0, ...createStreakCount() };
    const occurrences = createStreakCount();
    for (let index = 0; index < totalRounds; index++) {
        const result = generateResult(randomMode);
        const settlementResult = calculateSettlementResult(result);

        Object.keys(settlementResult).forEach((k) => {
            calculateStreaks(stats, settlementResult, occurrences, streaks, k);
        });
    }

    stats.streaks = streaks;

    console.log(`======== Run ${totalRounds} rounds for mode ${randomMode} ========`);
    console.log(stats);
}

const randomModes = [1, 2, 3];
const runNo = 3;

for (let randomMode of randomModes) {
    for (let i = 0; i < runNo; i++) {
        run(randomMode);
    }
}
