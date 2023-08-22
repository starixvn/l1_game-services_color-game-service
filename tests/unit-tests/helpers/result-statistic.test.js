import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 100,000 times", () => {
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                dragon: 0,
                tiger: 0,
                tie: 0,
                blackDragon: 0,
                redDragon: 0,
                blackTiger: 0,
                redTiger: 0,
            };

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                statisticResult.dragon += +settlementResult.dragon;
                statisticResult.tiger += +settlementResult.tiger;
                statisticResult.tie += +settlementResult.tie;
                statisticResult.blackDragon += +settlementResult.blackDragon;
                statisticResult.redDragon += +settlementResult.redDragon;
                statisticResult.blackTiger += +settlementResult.blackTiger;
                statisticResult.redTiger += +settlementResult.redTiger;
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            expect(resultPercentage.dragon).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tiger).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tie).toBeLessThanOrEqual(10);
            expect(resultPercentage.blackDragon).toBeGreaterThanOrEqual(48);
            expect(resultPercentage.redDragon).toBeGreaterThanOrEqual(48);
            expect(resultPercentage.blackDragon  + resultPercentage.redDragon).toBeGreaterThanOrEqual(99.9);            
            expect(resultPercentage.blackTiger).toBeGreaterThanOrEqual(48);
            expect(resultPercentage.redTiger).toBeGreaterThanOrEqual(48);
            expect(resultPercentage.blackTiger  + resultPercentage.redTiger).toBeGreaterThanOrEqual(99.9);
        });
    }
});
