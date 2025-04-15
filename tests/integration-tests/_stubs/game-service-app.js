import { Core, Table } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";
import ContainerRegistry from "../../../src/container-registry";

import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import { buildConfigs } from "./helper";
import { registerViewModule } from "../../../src/register-view-module";
import GameData from "../../../src/game-data";

export const run = async (processId, overrideAppConfigs) => {
    const appConfigs = Object.assign({}, buildConfigs(processId), overrideAppConfigs);

    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
    registerViewModule(app, container, definition);
};

const processId = process.argv[3];
const overrideAppConfigs = JSON.parse(process.argv[4]);
run(processId, overrideAppConfigs);
