import { stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";
import { Core } from "sc-game-base";

jest.mock("../../../src/constants");
jest.mock("sc-game-base/src/core/event-publishers/round-result-publisher");
jest.mock("sc-game-base/src/core/event-publishers/user-bet-result-publisher");

const endGame = jest.fn();
const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
const betsRepository = stubMongooseModelStupidly(mongoose.Model);
const definition = new Core.GameDefinition({ id: 1, name: "game name" }, jest.fn(), jest.fn());
const gameData = new Core.GameData();
gameData.gameConfigs = {
    enabled: true,
    minbet: 10,
    maxbet: 5000,
    choices_maxbet: { yellow: 3000, red: 3000, pink: 3000, white: 3000, blue: 3000, green: 3000, hot: 3000, cold: 3000 },
    odds: {
        single: 2,
        double: 3.5,
        triple: 6,
        hot: 2,
        cold: 2
    },
    enableFreeBet: false,
};

const roundResultPublisher = new Core.BaseEventPublishers.RoundResultPublisher("ColorGame", gameData);
const userBetResultPublisher = new Core.BaseEventPublishers.UserBetResultPublisher("ColorGame", gameData);
const consumer = new SettleGameRoundConsumer({
    definition,
    gameData,
});

describe("SettleGameRoundConsumer test", () => {
    it("should inherit base SettleGameRoundConsumer", () => {
        expect(SettleGameRoundConsumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer);
    });
});

describe("calculateBetResult test", () => {
    const testCases = [
        {
            roundResult: { dice1: 4, dice2: 4, dice3: 3 },
            settlementResult: {
                yellow: false, red: false, pink: false, white: true, blue: true, green: false, hot: false, cold: true
            },
            bet: { yellow: 0, red: 0, pink: 0, white: 1, blue: 1, green: 0, hot: 1, cold: 1 },
            expectResult: {
                totalBetAmount: 4,
                totalWin: 7.5,
                netWin: 4.5,
                totalLost: 1,
                winningByChoices: { yellow: 0, red: 0, pink: 0, white: 2, blue: 3.5, green: 0, hot: 0, cold: 2 },
            },
        }
    ];

    it.each(testCases)("should return correct result", ({ settlementResult, bet, roundResult, expectResult }) => {
        // act
        const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds, roundResult);

        // assert
        expect(actualResult).toEqual(expectResult);
    });
});

describe("settleBets test", () => {
    it("should settle all bets and publish to game client", async () => {
        // arrange
        const result = { dice1: 5, dice2: 5, dice3: 5 };
        const settlementResult = { yellow: false, red: false, pink: false, white: false, blue: false, green: true, hot: false, cold: true };

        definition.generateResult.mockReturnValueOnce(result);
        definition.settle.mockReturnValueOnce(settlementResult);
        roundsRepository.create.mockReturnValueOnce({ id: 1, result, settlementResult });

        const termConsumer = new SettleGameRoundConsumer({
            definition,
            gameData,
            roundResultPublisher,
            userBetResultPublisher,
            endGame,
            roundsRepository,
            betsRepository,
        });
        termConsumer.callEndGame = jest.fn();
        termConsumer.queryBets = jest.fn(() => [
            { yellow: 100, save: jest.fn() },
            { white: 200, freeBet: true, save: jest.fn() },
        ]);

        // act
        await termConsumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

        // assert
        expect(termConsumer.callEndGame).toHaveBeenCalled();
        expect(userBetResultPublisher.publish).toHaveBeenCalled();
    });
});

describe("getWinningOddName", () => {
    it("when choice is hot and win - return hot", () => {
        // arrange
        const roundResult = {};
        const choice = "hot";
        const win = true;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("hot");
    })

    it("when choice is hot and NOT win - return empty", () => {
        // arrange
        const roundResult = {};
        const choice = "hot";
        const win = false;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("");
    })

    it("when choice is cold and win - return cold", () => {
        // arrange
        const roundResult = {};
        const choice = "cold";
        const win = true;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("cold");
    })

    it("when choice is cold and NOT win - return empty", () => {
        // arrange
        const roundResult = {};
        const choice = "cold";
        const win = false;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("");
    })


    it("when choice is 1 yellow and win - return single", () => {
        // arrange
        const roundResult = {
            dice1: 0, dice2: 1, dice3: 2
        };
        const choice = "yellow";
        const win = true;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("single");
    })

    it("when choice is 2 yellow and win - return double", () => {
        // arrange
        const roundResult = {
            dice1: 0, dice2: 0, dice3: 2
        };
        const choice = "yellow";
        const win = true;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("double");
    })

    it("when choice is 3 yellow and win - return triple", () => {
        // arrange
        const roundResult = {
            dice1: 0, dice2: 0, dice3: 0
        };
        const choice = "yellow";
        const win = true;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("triple");
    })

    it("when choice is 3 yellow and NOT win - return empty", () => {
        // arrange
        const roundResult = {};
        const choice = "yellow";
        const win = false;

        // act
        const result = consumer.getWinningOddName(roundResult, choice, win);

        // assert
        expect(result).toBe("");
    })
})

beforeEach(() => {
    jest.clearAllMocks();
});
