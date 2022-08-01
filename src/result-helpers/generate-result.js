import Chance from "chance";
import randomLib1 from "random";
import { Random, MersenneTwister19937 } from "random-js";
import { randomInt } from "crypto";

function random1(min, max) {
    return randomInt(min, max + 1);
}

function random2(min, max) {
    const chance = new Chance();
    return chance.natural({ min: min, max: max });
}

function random3(min, max) {
    const chance = new Chance();
    return chance.integer({ min: min, max: max });
}

function random4(min, max) {
    return randomLib1.int(min, max);
}

function random5(min, max) {
    const randomJs = new Random(MersenneTwister19937.autoSeed());
    return randomJs.integer(min, max);
}

const randomModes = {
    1: [random2],
    2: [random1, random3],
    3: [random4, random5],
};

const generateHandResult = (randomMode) => {
    const randomFunctions = randomModes[randomMode] || randomModes[1];

    const chance = new Chance();
    const randomFunction = chance.pickone(randomFunctions);

    const red1 = chance.bool();
    const red2 = randomFunction(0, 5) + randomFunction(0, 5) + randomFunction(0, 5) + 3 <= 10;
    const red3 = randomFunction(1, 10000) % 2 !== 0;
    const red4 = (randomFunction(0, 5) + randomFunction(0, 5) + randomFunction(0, 5) + 3) % 2 === 0;

    return { red1, red2, red3, red4 };
};

export const generateResult = (randomMode) => {
    return {
        player: generateHandResult(randomMode),
        banker: generateHandResult(randomMode),
    };
};
