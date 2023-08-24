import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 10,000 times", () => {
    // arrange
    const total = 10000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                yellow: 0,
                red: 0,
                pink: 0,
                white: 0,
                blue: 0,
                green: 0,
                hot: 0,
                cold: 0,
            };

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                statisticResult.yellow += +settlementResult.yellow;
                statisticResult.red += +settlementResult.red;
                statisticResult.pink += +settlementResult.pink;
                statisticResult.white += +settlementResult.white;
                statisticResult.blue += +settlementResult.blue;
                statisticResult.green += +settlementResult.green;
                statisticResult.hot += +settlementResult.hot;
                statisticResult.cold += +settlementResult.cold;
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            expect(resultPercentage.yellow).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.red).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.pink).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.white).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.blue).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.green).toBeGreaterThanOrEqual(40);
            expect(resultPercentage.hot).toBeGreaterThanOrEqual(48);
            expect(resultPercentage.cold).toBeGreaterThanOrEqual(48);            
        });
    }
});
