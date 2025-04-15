import { Core } from "sc-game-base";

export default class GameStatusPublisher extends Core.BaseEventPublishers.GameStatusPublisher {
    publishToAllUsers(payload) {
        super.publishToAllUsers(payload);

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            socket && socket.emit(this.gameName, payload);
        });
    }

    publishEnablingGameStatus() {
        super.publishEnablingGameStatus();

        const { gameConfigs, remainingTime } = this.gameData;
        const configs = {
            odds: gameConfigs.odds,
            originalOdds: gameConfigs.originalOdds,
            enableFreeBet: gameConfigs.enableFreeBet,
        };

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            const payload = { gameConfigs: { ...configs }, remainingTime, snr: true };
            socket && socket.emit(this.gameName, payload);
        });
    }
}
