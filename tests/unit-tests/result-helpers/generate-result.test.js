import { generateResult } from "../../../src/result-helpers/generate-result";

const chanceMock = { pickoneIndex: 0 };

jest.mock("chance", () => {
    return function () {
        const orig = {
            ...jest.requireActual("chance"),
        };

        return {
            bool: () => new orig.Chance().bool(),
            natural: (opt) => {
                return new orig.Chance().natural(opt);
            },
            integer: (opt) => {
                return new orig.Chance().integer(opt);
            },
            pickone: (arr) => arr[chanceMock.pickoneIndex],
        };
    };
});

describe("generateResult tests", () => {
    const testCases = [
        { randomMode: 1, pickoneIndex: 0 },
        { randomMode: 2, pickoneIndex: 0 },
        { randomMode: 2, pickoneIndex: 1 },
        { randomMode: 3, pickoneIndex: 0 },
        { randomMode: 3, pickoneIndex: 1 },
        { randomMode: 4, pickoneIndex: 0 },
    ];
    it.each(testCases)("should return enough results", (testCase) => {
        // arrange
        chanceMock.pickoneIndex = testCase.pickoneIndex;

        // act
        const result = generateResult(testCase.randomMode);

        // assert
        expect(Object.keys(result.player).length).toBe(4);
        expect(Object.keys(result.banker).length).toBe(4);
    });
});
