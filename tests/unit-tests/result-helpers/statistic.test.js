import { calculateSettlementResult } from "../../../src/result-helpers/calculate-settlement-result";
import { generateResult } from "../../../src/result-helpers/generate-result";

describe("result statistic: 100000 rounds", () => {
    const calculateStreaks = (streaks, settlementResult, continuity) => {
        Object.keys(continuity).forEach((key) => {
            if (settlementResult[key]) {
                continuity[key]++;
            } else {
                if (continuity[key] >= 4) {
                    streaks[key][continuity[key]] = streaks[key][continuity[key]] ?? 0;
                    streaks[key][continuity[key]] += 1;
                }
                continuity[key] = 0;
            }
        });
    };

    const createStreakCount = () => {
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
    };

    [1, 2, 3].forEach((randomMode) => {
        it(`should generate results statistically correct with mode ${randomMode}`, () => {
            // arrange
            const statistic = {
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
            const streaks = {
                player: {},
                banker: {},
                tie: {},
                odd: {},
                even: {},
                playerOdd: {},
                playerEven: {},
                bankerOdd: {},
                bankerEven: {},
            };
            const totalRounds = 100_000;
            const continuity = createStreakCount();

            // act
            for (let i = 0; i < totalRounds; i++) {
                const roundResult = generateResult(randomMode);
                const settlementResult = calculateSettlementResult(roundResult);
                Object.keys(settlementResult).forEach((key) => {
                    statistic[key] += +settlementResult[key];
                });
                calculateStreaks(streaks, settlementResult, continuity);
            }

            // assert
            const resultPercentage = Object.keys(statistic).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statistic[key] / totalRounds) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${randomMode}, countResult: ${JSON.stringify(statistic)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`streak on mode ${randomMode}: ${JSON.stringify(streaks, null, 2)}`);

            expect(resultPercentage.player).toBeGreaterThanOrEqual(35.5);
            expect(resultPercentage.banker).toBeGreaterThanOrEqual(35.5);
            expect(resultPercentage.tie).toBeLessThanOrEqual(28);
            expect(resultPercentage.odd).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.even).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.playerOdd).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.playerEven).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.bankerOdd).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.bankerEven).toBeGreaterThanOrEqual(49);
            expect(resultPercentage.playerRed3).toBeGreaterThanOrEqual(24);
            expect(resultPercentage.playerRed4).toBeGreaterThanOrEqual(6);
            expect(resultPercentage.playerWhite3).toBeGreaterThanOrEqual(24);
            expect(resultPercentage.playerWhite4).toBeGreaterThanOrEqual(6);
            expect(resultPercentage.bankerRed3).toBeGreaterThanOrEqual(24);
            expect(resultPercentage.bankerRed4).toBeGreaterThanOrEqual(6);
            expect(resultPercentage.bankerWhite3).toBeGreaterThanOrEqual(24);
            expect(resultPercentage.bankerWhite4).toBeGreaterThanOrEqual(6);
        });
    });
});
