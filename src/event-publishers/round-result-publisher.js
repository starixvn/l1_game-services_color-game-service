import { Core } from "sc-game-base";

export default class RoundResultPublisher extends Core.BaseEventPublishers.RoundResultPublisher {
    publishToAllUsers(payload) {
        super.publishToAllUsers(payload);

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            socket && socket.emit(this.gameName, payload);
        });
    }
}
