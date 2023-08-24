import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
describe("result-helper test", () => {
    describe("generateResult", () => {
        it("should generate 3 dices in range 0-5", () => {
            // act 
            const result = generateResult();

            // assert
            expect(result.dice1).toBeWithin(0, 6);
            expect(result.dice2).toBeWithin(0, 6);
            expect(result.dice3).toBeWithin(0, 6);
        })
    })   
    describe("getSettlementResult", () => {
        it("should return yellow when having dice 0", () => {
            // arrange
            const roundResult = {
                dice1: 0,
                dice2: 0, 
                dice3: 0
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.yellow).toBe(true);
        });

        it("should return red when having dice 1", () => {
            // arrange
            const roundResult = {
                dice1: 1,
                dice2: 1, 
                dice3: 1
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.red).toBe(true);
        });

        it("should return pink when having dice 2", () => {
            // arrange
            const roundResult = {
                dice1: 2,
                dice2: 2, 
                dice3: 2
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.pink).toBe(true);
        });

        it("should return white when having dice 3", () => {
            // arrange
            const roundResult = {
                dice1: 3,
                dice2: 3, 
                dice3: 3
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.white).toBe(true);
        });

        it("should return blue when having dice 4", () => {
            // arrange
            const roundResult = {
                dice1: 4,
                dice2: 4, 
                dice3: 4
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.blue).toBe(true);
        });

        it("should return green when having dice 5", () => {
            // arrange
            const roundResult = {
                dice1: 5,
                dice2: 5, 
                dice3: 5
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.green).toBe(true);
        });

        it("should return hot when having 2 dices in yellow, red, pink", () => {
            // arrange
            const roundResult = {
                dice1: 0,
                dice2: 1, 
                dice3: 5
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.hot).toBe(true);
        });

        it("should return cold when having 2 dices in white, blue, green", () => {
            // arrange
            const roundResult = {
                dice1: 3,
                dice2: 3, 
                dice3: 5
            };

            // act
            const actual = getSettlementResult(roundResult);

            // assert
            expect(actual.cold).toBe(true);
        });
    });
});
