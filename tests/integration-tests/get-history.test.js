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

xdescribe("when get history", () => {
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
                dragon: 10,
                tiger: 0,
                tie: 100,
                blackDragon: 0,
                redDragon: 0,
                blackTiger: 0,
                redTiger: 0,
                freeBet: false,
                name: "NormalUser",
                odds: { dragon: 1.97, tiger: 1.97, tie: 3.76, blackDragon: 3.76, redDragon: 14.5, blackTiger: 14.5, redTiger: 2.5 },
                rate: 1,
                betLogDetails: [{choice: "tie", amount: 100, rebet: false, rate: 1, roundId: 1190120}],
                roundId: 1190120,
                phien: 1190120,
                totalAmount: 110
            },
            {
                dragon: 102,
                tiger: 0,
                tie: 12,
                blackDragon: 0,
                redDragon: 0,
                blackTiger: 0,
                redTiger: 0,
                freeBet: false,
                name: "NormalUser",
                odds: { dragon: 1.97, tiger: 1.97, tie: 3.76, blackDragon: 3.76, redDragon: 14.5, blackTiger: 14.5, redTiger: 2.5 },
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