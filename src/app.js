import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import ContainerRegistry from "./container-registry";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import { registerViewModule } from "./register-view-module";
import GameData from "./game-data";

const run = async () => {
    const definition = new Table.TableGameDefinition(gameSettings, resultHelper.generateResult, resultHelper.getSettlementResult);

    const gameData = new GameData(gameSettings.durations.wholeRound);
    gameData.viewPlayers = {};

    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);

    registerViewModule(app, container, definition);
};

run();
