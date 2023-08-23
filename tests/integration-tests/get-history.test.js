import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { startService } from "./_stubs/test-jobs";
import { getProcessId, buildConfigs, initUserSession, checkConnect } from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = {botenabled: false};
startService(processId, overrideGameConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when get history", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should return history", (done) => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        client.handleSignedInEvent(() => {
            client.sendInGameEvent();
        });
        const expectedData = [
            {
                yellow: 0,
                red: 10,
                pink: 0,
                white: 0,
                blue: 0,
                green: 0,
                hot: 0,
                cold: 0,
                freeBet: false,
                name: "NormalUser",
                odds: { single: 1.97, double: 2.97, triple: 3.76, hot: 3.76, cold: 2.5 },
                rate: 1,
                betLogDetails: [{choice: "red", amount: 10, rebet: false, rate: 1, roundId: 1190120}],
                roundId: 1190120,
                phien: 1190120,
                totalAmount: 110
            },
            {
                yellow: 102,
                red: 0,
                pink: 12,
                white: 0,
                blue: 0,
                green: 0,
                hot: 0,
                cold: 0,
                freeBet: false,
                name: "NormalUser",
                odds: { single: 1.97, double: 2.97, triple: 3.76, hot: 3.76, cold: 2.5 },
                rate: 1,
                betLogDetails: [],
                roundId: 1190119,
                phien: 1190119,
                totalAmount: 114
            },
        ];

        client.on(socketOptions.gameName, (inGameData) => {
            if (inGameData.remainingTime) {
                setTimeout(() => {
                    // Act
                    client.sendGetHistoryEvent();

                    // Assert
                    client.on(socketOptions.gameName, (data) => {
                        if (data.history) {
                            const actualBetLogs = data.history.betLogs.map((betLog) => {
                                delete betLog.result;
                                delete betLog.settlementResult;
                                delete betLog.betwin;
                                return betLog;
                            });

                            expect(actualBetLogs).toEqual(expectedData);
                            expect(data.history.total).toBeGreaterThan(0);
                            expect(data.history.page).toBe(1);
                            expect(data.history.pageSize).toBe(8);

                            client.close();
                            done();
                        }
                    });
                }, 1000);
            }
        });
    });
});
;