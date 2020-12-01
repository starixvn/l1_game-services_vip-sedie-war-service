import Chance from "chance";

const generateHandResult = () => {
    const chance = new Chance();
    const red1 = chance.bool();
    const red2 = chance.natural({ min: 0, max: 5 }) + chance.natural({ min: 0, max: 5 }) + chance.natural({ min: 0, max: 5 }) + 3 <= 10;
    const red3 = chance.natural({ min: 1, max: 10000 }) % 2 !== 0;
    const red4 =
        (chance.natural({ min: 0, max: 5 }) + chance.natural({ min: 0, max: 5 }) + chance.natural({ min: 0, max: 5 }) + 3) % 2 === 0;

    return { red1, red2, red3, red4 };
};

export const generateResult = () => {
    return {
        player: generateHandResult(),
        banker: generateHandResult(),
    };
};
