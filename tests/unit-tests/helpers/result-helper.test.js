import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
xdescribe("result-helper test", () => {   
    describe("getSettlementResult", () => {
        it("should return as expected", () => {
            // arrange
            const roundResult = {
                dragon: { rank: 0, suit: 0 },
                tiger: { rank: 10, suit: 1 },                
            };
            const expected = "{A♥ J♦}";

            // act
            //const actual = generateRawResultForHash(roundResult);

            // assert
            //expect(actual).toBe(expected);
        });
    });
});
