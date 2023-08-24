import Chance from "chance";
import Random from "random";
import crypto from "crypto";
import { Random as RandomJS, MersenneTwister19937 } from "random-js";
import _ from "lodash";
import randomInteger from "random-int";

const random1 = () => {
    return crypto.randomInt(1, 7);
};

const random2 = () => {
    const chance = new Chance();
    return chance.d6();
};

const random3 = () => {
    const chance = new Chance();
    return chance.integer({ min: 1, max: 6 });
};

const random4 = () => {
    return Random.int(1, 6);
};

const random5 = () => {
    const Random5 = new RandomJS(MersenneTwister19937.autoSeed());
    return Random5.integer(1, 6);
};

function random6() {
    return _.random(1, 6);
}

function random7() {
    return randomInteger(1, 6);
}

export const randomModes = {
    1: [random1, random2, random3, random4, random5],
    2: [random2, random4, random6],
    3: [random3, random5, random7],
};

export const random = (randomMode) => {
    const randomFunctions = randomModes[randomMode] || randomModes[1];

    const chance = new Chance();
    const shuffleRandoms = chance.shuffle(randomFunctions);
    const randomFunction = chance.pickone(shuffleRandoms);

    return randomFunction();
};
