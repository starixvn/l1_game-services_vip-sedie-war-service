import { generateResult } from "../generate-result";

describe("generateResult tests", () => {
    it("should return enough results", () => {
        // act
        var result = generateResult();

        // assert
        expect(Object.keys(result.player).length).toBe(4);
        expect(Object.keys(result.banker).length).toBe(4);
    });
});
