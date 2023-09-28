import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 10,000 times", () => {
    // arrange
    const total = 10000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange           
            const hots = [];
            const colds = [];

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                hots.push(settlementResult.hot);
                colds.push(settlementResult.cold);               
            }          

            // assert          
            var count = (JSON.stringify(hots).match(/true,true,true,true,true/g) || []).length;
            console.log(count);

            const hotStatistic = calStatistic(hots);
            const coldStatistic = calStatistic(colds);
            console.log("Mode: ", index + 1);
            console.log("hots", hotStatistic)
            console.log("colds", coldStatistic);                  
        });
    }
});


const calStatistic = (dataInArray) => {
    const dataInString = JSON.stringify(dataInArray);
    const lengthsToEvaluate = Array.from({length:15},(v,k)=>k+5);
    const result = {};
    lengthsToEvaluate.forEach(length => {
        result[length] = (dataInString.match(new RegExp(Array(length).fill('true').join(","), 'g')) || []).length
    })

    return result;
}
