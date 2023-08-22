import { stub } from "jest-micro-auto-stub";
import { Core, Table } from "sc-game-base";

import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";

jest.mock("../../../src/helpers/result-helper.js");
describe("SettleGameRoundConsumer tests", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "game name" });
    definition.choices = ["dragon", "tiger", "tie", "blackDragon", "redDragon", "blackTiger", "redTiger"];
    definition.generateResult = jest.fn();
    definition.settle = jest.fn();
    const gameData = new Table.TableGameData(0);
    const roundResultPublisher = stub(Core.BaseEventPublishers.RoundResultPublisher);
    const userBetResultPublisher = stub(Core.BaseEventPublishers.UserBetResultPublisher);
    const endGame = jest.fn();

    /** @type {mongoose.Model}*/
    const roundsRepository = { find: () => {}, create: () => {} };
    /** @type {mongoose.Model}*/
    const betsRepository = { find: () => {} };

    /** @type {mongoose.Model}*/
    const tempBetsRepository = { find: () => {} };

    const consumer = new SettleGameRoundConsumer({
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
        endGame,
        roundsRepository,
        betsRepository,
        tempBetsRepository,
    });

    it("Inherit Table.EventConsumers.TableSettleGameRoundConsumer", () => {
        expect(consumer instanceof Table.EventConsumers.TableSettleGameRoundConsumer).toBeTruthy();
    });    

    describe("calculateBetResult", () => {
        it("Returns correct result when win normally", () => {
            const settlementResult = {
                dragon: false,
                tiger: false,
                tie: true,
                blackDragon: false,
                redDragon: true,
                blackTiger: false,
                redTiger: false,                
            };
            const result = consumer.calculateBetResult(settlementResult, { tie: 10 }, { dragon: 2, tiger: 2, tie: 10, blackDragon: 2, redDragon: 2, blackTiger: 2, redTiger: 2 });

            expect(result.netWin).toEqual(90);
            expect(result.winningByChoices.tie).toEqual(100);
        });

        it("Returns correct result when refund by tie", () => {
            const settlementResult = {
                dragon: false,
                tiger: false,
                tie: true,
                blackDragon: false,
                redDragon: true,
                blackTiger: false,
                redTiger: false,                
            };
            const result = consumer.calculateBetResult(settlementResult, { dragon: 10 }, { dragon: 2, tiger: 2, tie: 10, blackDragon: 2, redDragon: 2, blackTiger: 2, redTiger: 2 });

            expect(result.totalWin).toEqual(5);            
        });
    });
});
