import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { startService } from "./_stubs/test-jobs";
import {
    getProcessId,
    buildConfigs,
    getTimeOutToBetInvalid,
    getTimeOutToPlacingBetTime,
    initUserSession,
    checkConnect,
} from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
startService(processId);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

xdescribe("bot", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should receive bot bets", (done) => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        client.handleSignedInEvent(() => {
            client.sendInGameEvent();
        });
        
        // Assert
        client.on(socketOptions.gameName, (data) => {
            if (data.playerChip) {
                client.close();
                done();
            }
        });
    });
});
