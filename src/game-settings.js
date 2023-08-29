export default {
    id: 71,
    name: "ColorGame",
    durations: {
        wholeRound: 40,
        placingBets: 30,
        lockingBet: 5,
    },
    choices: ["yellow", "red", "pink", "white", "blue", "green", "hot", "cold"],
    choicesMapper: { yellow: 1, red: 2, pink: 3, white: 4, blue: 5, green: 6, hot: 7, cold: 8 },
    hedgeBetGroups: [
        ["hot", "cold"]
    ],
    numberOfRoundHistory: 100,
};
