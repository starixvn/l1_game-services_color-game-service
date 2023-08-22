import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { startService } from "./_stubs/test-jobs";
import {
    getProcessId,
    buildConfigs,   
    initUserSession,
    checkConnect,
} from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = {botenabled: false};
const overrideAppConfigs = { enabledBoostedOdds: false };
startService(processId, overrideGameConfigs, overrideAppConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when user joins game", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should return game configs", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.gameConfigs) {
                expect(inGameData.gameConfigs.minBet).toEqual(1);
                expect(inGameData.gameConfigs.maxBet).toEqual(3000);
                expect(inGameData.gameConfigs.maxBetPerChoices).toStrictEqual({ yellow: 3000, red: 3000, pink: 3000, white: 3000, blue: 3000, green: 3000, hot: 3000, cold: 3000 });
                expect(inGameData.gameConfigs.odds).toStrictEqual({ single: 1.97, double: 2.97, triple: 3.76, hot: 3.76, cold: 2.5 });

                normalUserClientDriver.close();
                done();
            }
        });
    });

    it("should return user info", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.user?.UID) {
                expect(inGameData.user).toStrictEqual({
                    UID: 1,
                    avatarId: 1,
                    currency: "$US",
                    name: "NormalUser",
                    rate: 1,
                    red: 25000,
                    type: false,
                });

                normalUserClientDriver.close();
                done();
            }
        });
    });

    it("should return round history", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.roundHistory) {
                expect(inGameData.roundHistory.length).toBeGreaterThan(0);

                normalUserClientDriver.close();
                done();
            }
        });
    });
});
