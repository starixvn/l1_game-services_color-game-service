import awilix from "awilix";
import { Table, Core } from "sc-game-base";
import { SettleGameRoundConsumer, PlaceBetConsumer, UserSignConsumer } from "./consumers";
import { bets, rounds, tmpBets, betLogs } from "./models/index";
import { Bot, ProcessBetQueue } from "./crons/index";
import { RebetContainerRegistry } from "sc-rebet-mode";
import HistoryQuery from "./query-apis/history-query";
import ViewConsumer from "./consumers/view-consumer";
import BaseViewRouter from "./routers/base-view-router";
import GameStatusPublisher from "./event-publishers/game-status-publisher";
import RoundResultPublisher from "./event-publishers/round-result-publisher";

const { asClass, asValue } = awilix;

export default class ContainerRegistry extends Table.TableContainerRegistry {
    register(appConfigs, definition, gameData) {
        super.register(appConfigs, definition, gameData);

        this.container.register(new RebetContainerRegistry().registerTableGame(Core.Routers.BaseSocketRouter));
        this.container.register({
            processBetQueue: asClass(ProcessBetQueue).singleton().proxy(),
        });

        return this.container;
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            betLogsRepository: asValue(betLogs),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
            userSignInConsumer: asClass(UserSignConsumer).singleton(),
            viewConsumer: asClass(ViewConsumer).singleton(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            historyQuery: asClass(HistoryQuery).singleton(),
        });
    }

    registerRouters() {
        super.registerRouters();

        this.container.register({
            baseViewRouter: asClass(BaseViewRouter).proxy(),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            gameStatusPublisher: asClass(GameStatusPublisher).singleton(),
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
        });
    }
}
