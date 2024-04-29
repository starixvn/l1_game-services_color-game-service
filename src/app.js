import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import ContainerRegistry from "./container-registry";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import { FairnessGameBase } from "./fairness/random-fairness";

const run = async () => {
    const definition = new Table.TableGameDefinition(gameSettings, resultHelper.generateResult, resultHelper.getSettlementResult);
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new FairnessGameBase(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
