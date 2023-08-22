import gameSetting from "../../../src/game-settings";

const game = {
    id: gameSetting.id,
    name: gameSetting.name,
};

const currencyData = { code: "USD", name: "$US" };

const socketOptionsFunc = (port) => {
    return {
        socketUri: `http://localhost:${port}/user/${gameSetting.name.toLowerCase()}`,
        gameName: game.name,
        proxyRoute: "/socket.io",
    };
};

const gameConfig = {
    type: 0,
    name: gameSetting.name.toLowerCase(),
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: { yellow: 3000, red: 3000, pink: 3000, white: 3000, blue: 3000, green: 3000, hot: 3000, cold: 3000 },
    odds: { single: 1.97, double: 2.97, triple: 3.76, hot: 3.76, cold: 2.5 },
    botenabled: true,
    hour_maxbot: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bot_maxbet: 1000,
    choices_maxbet: { yellow: 10000, red: 10000, pink: 10000, white: 10000, blue: 10000, green: 10000, hot: 10000, cold: 10000 },
};

const roundsData = [
    {
        id: 1190119,
        result: { dice1: 0, dice2: 0, dice3: 0 },
        settlementResult: { yellow: true, red: false, pink: false, white: false, blue: false, green: false, hot: true, cold: false},
        exchangeRateId: 1,
    },
    {
        id: 1190118,
        result: { dice1: 0, dice2: 1, dice3: 0 },
        settlementResult: { yellow: true, red: true, pink: false, white: false, blue: false, green: false, hot: true, cold: false},
        exchangeRateId: 1,
    },
    {
        id: 1190117,
        result: { dice1: 3, dice2: 4, dice3: 5 },
        settlementResult: { yellow: false, red: false, pink: false, white: true, blue: true, green: true, hot: false, cold: true},
        exchangeRateId: 1,
    },
];

const userBetData = (uid) => {
    return [
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: 1,
            name: "NormalUser",
            odds: gameConfig.odds,
            operatorId: "dummy-operator-id",
            rate: 1,
            yellow: 102,
            red: 0,
            pink: 12,
            white: 0,
            blue: 0,
            green: 0,
            hot: 0,
            cold: 0,
            siteId: "111",
            roundId: 1190119,
            paid: true,
            totalAmount: 114,
        },
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: 4,
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            operatorId: "dummy-operator-id",
            rate: 1,
            yellow: 0,
            red: 10,
            pink: 0,
            white: 0,
            blue: 0,
            green: 0,
            hot: 0,
            cold: 0,
            siteId: "111",
            roundId: 1190120,
            paid: true,
            totalAmount: 110,
        },
    ];
};


const userBetLogData = (uid) => {
    return [
        {
            uid: uid,
            currency: "$US",
            playerId: 1,
            name: "NormalUser",
            operatorId: "dummy-operator-id",
            choice: "red",
            amount: 10,
            rate: 1,
            siteId: "111",
            roundId: 1190120,            
        },        
    ];
};

const promotions = [
    {
        gameId: gameSetting.id,
        startDateTime: new Date(new Date().setSeconds(new Date().getSeconds() + 15)),
        endDateTime: new Date(new Date().setSeconds(new Date().getSeconds() + 15 + 6)),
        isDaily: false,
        odds: { single: 1.97, double: 2.97, triple: 3.76, hot: 3.76, cold: 2.5 },
        status: "enabled",
    },
];

export { game, currencyData, socketOptionsFunc, gameConfig, roundsData, userBetData, promotions, userBetLogData };
