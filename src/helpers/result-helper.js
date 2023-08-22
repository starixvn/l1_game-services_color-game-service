import { Chance } from "chance";
import * as DiceRandom from "./dice-random";

const settlementRuleEntries = Object.entries({
    yellow: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.yellow),
    red: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.red),
    pink: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.pink),
    white: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.white),
    blue: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.blue),
    green: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.green),
    hot: (diceArray) => diceArray.filter((dice) => dice < 3).length >= 2,
    cold: (diceArray) => diceArray.filter((dice) => dice >= 3).length >= 2,
});

export const generateResult = (randomMode) => {
    const resultArray = [];

    for (let index = 0; index < 100; index++) {
        resultArray.push(DiceRandom.random(randomMode) - 1);
    }

    const chance = new Chance();
    const pickedRandoms = chance.pickset(resultArray, 3);

    return { dice1: pickedRandoms[0], dice2: pickedRandoms[1], dice3: pickedRandoms[2] };
};

export const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};