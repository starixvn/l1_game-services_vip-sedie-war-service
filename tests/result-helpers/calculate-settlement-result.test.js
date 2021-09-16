import { calculateSettlementResult } from "../../src/result-helpers/calculate-settlement-result";

describe("calculateSettlementResult tests", () => {
    it("should return Player if total points of player is greater than banker", () => {
        // arrange
        const player = { red1: true, red2: true, red3: false, red4: false };
        const banker = { red1: true, red2: false, red3: false, red4: false };
        const expected = setSettlementResult(["player", "odd", "bankerOdd", "bankerWhite3", "playerEven"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return Banker if total points of banker is greater than player", () => {
        // arrange
        const player = { red1: true, red2: false, red3: false, red4: false };
        const banker = { red1: true, red2: true, red3: false, red4: false };
        const expected = setSettlementResult(["banker", "odd", "bankerEven", "playerWhite3", "playerOdd"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return Tie if total points of banker is equal player", () => {
        // arrange
        const player = { red1: true, red2: true, red3: false, red4: false };
        const banker = { red1: true, red2: true, red3: false, red4: false };
        const expected = setSettlementResult(["tie", "even", "bankerEven", "playerEven"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return Even if total points of banker and player is odd", () => {
        // arrange
        const player = { red1: true, red2: true, red3: true, red4: false };
        const banker = { red1: true, red2: false, red3: false, red4: false };
        const expected = setSettlementResult(["player", "even", "bankerOdd", "bankerWhite3", "playerOdd", "playerRed3"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return Odd if total points of banker and player is odd", () => {
        // arrange
        const player = { red1: true, red2: true, red3: true, red4: true };
        const banker = { red1: true, red2: false, red3: false, red4: false };
        const expected = setSettlementResult(["player", "odd", "bankerOdd", "bankerWhite3", "playerEven", "playerRed4"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return white3 when both banker and player have 1 reds", () => {
        // arrange
        const player = { red1: true, red2: false, red3: false, red4: false };
        const banker = { red1: true, red2: false, red3: false, red4: false };
        const expected = setSettlementResult(["tie", "even", "bankerOdd", "bankerWhite3", "playerOdd", "playerWhite3"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return white4 when both banker and player have 0 reds", () => {
        // arrange
        const player = { red1: false, red2: false, red3: false, red4: false };
        const banker = { red1: false, red2: false, red3: false, red4: false };
        const expected = setSettlementResult(["tie", "even", "bankerEven", "bankerWhite4", "playerEven", "playerWhite4"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return red3 when both banker and player have 3 reds", () => {
        // arrange
        const player = { red1: true, red2: true, red3: true, red4: false };
        const banker = { red1: true, red2: true, red3: true, red4: false };
        const expected = setSettlementResult(["tie", "even", "bankerOdd", "bankerRed3", "playerOdd", "playerRed3"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return red4 when both banker and player have 4 reds", () => {
        // arrange
        const player = { red1: true, red2: true, red3: true, red4: true };
        const banker = { red1: true, red2: true, red3: true, red4: true };
        const expected = setSettlementResult(["tie", "even", "bankerEven", "bankerRed4", "playerEven", "playerRed4"]);

        // act
        const result = calculateSettlementResult({ player, banker });

        // assert
        expect(result).toStrictEqual(expected);
    });
});

function setSettlementResult(winningOptions) {
    const options = [
        "player",
        "banker",
        "tie",
        "odd",
        "even",
        "playerOdd",
        "playerEven",
        "playerRed3",
        "playerRed4",
        "playerWhite3",
        "playerWhite4",
        "bankerOdd",
        "bankerEven",
        "bankerRed3",
        "bankerRed4",
        "bankerWhite3",
        "bankerWhite4",
    ];

    const settlement = {};
    options.forEach((option) => {
        settlement[option] = winningOptions.includes(option) ? true : false;
    });

    return settlement;
}
