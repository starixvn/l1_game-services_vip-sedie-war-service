const calculateTotalPoints = (result) => Object.values(result).filter((button) => button).length;

const settlementRuleEntries = Object.entries({
    player: ({ player, banker }) => calculateTotalPoints(player) > calculateTotalPoints(banker),
    banker: ({ player, banker }) => calculateTotalPoints(player) < calculateTotalPoints(banker),
    tie: ({ player, banker }) => calculateTotalPoints(player) === calculateTotalPoints(banker),
    odd: ({ player, banker }) => (calculateTotalPoints(player) + calculateTotalPoints(banker)) % 2 === 1,
    even: ({ player, banker }) => (calculateTotalPoints(player) + calculateTotalPoints(banker)) % 2 === 0,

    playerOdd: ({ player }) => calculateTotalPoints(player) % 2 === 1,
    playerEven: ({ player }) => calculateTotalPoints(player) % 2 === 0,
    playerRed3: ({ player }) => calculateTotalPoints(player) === 3,
    playerRed4: ({ player }) => calculateTotalPoints(player) === 4,
    playerWhite3: ({ player }) => calculateTotalPoints(player) === 1,
    playerWhite4: ({ player }) => calculateTotalPoints(player) === 0,

    bankerOdd: ({ banker }) => calculateTotalPoints(banker) % 2 === 1,
    bankerEven: ({ banker }) => calculateTotalPoints(banker) % 2 === 0,
    bankerRed3: ({ banker }) => calculateTotalPoints(banker) === 3,
    bankerRed4: ({ banker }) => calculateTotalPoints(banker) === 4,
    bankerWhite3: ({ banker }) => calculateTotalPoints(banker) === 1,
    bankerWhite4: ({ banker }) => calculateTotalPoints(banker) === 0,
});

export const calculateSettlementResult = (roundResult) => {
    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(roundResult);

        return result;
    }, {});
};
