import { Socket } from "socket.io";

export default class BaseViewRouter {
    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        playGamePermissionValidator,
        viewConsumer,
    }) {
        this.definition = definition;
        this.gameData = gameData;
        this.userSignInConsumer = userSignInConsumer;
        this.inGameConsumer = inGameConsumer;
        this.placeBetConsumer = placeBetConsumer;
        this.userDisconnectConsumer = userDisconnectConsumer;
        this.userSignInPublisher = userSignInPublisher;
        this.historyQuery = historyQuery;
        this.logService = logService;
        this.playGamePermissionValidator = playGamePermissionValidator;
        this.viewConsumer = viewConsumer;
    }

    /**
     * @param {Socket} socketClient
     */
    init(socketClient) {
        this.socketClient = socketClient;
        this.socketClient.on("inGame", this.handleInGame.bind(this));
        this.socketClient.on("disconnect", this.handleDisconnect.bind(this));
    }

    async handleInGame(payload) {
        try {
            if (!this.verify()) {
                return;
            }

            if (!this.gameData.viewPlayers) {
                this.gameData.viewPlayers = {};
            }

            this.gameData.viewPlayers[this.socketClient.id] = this.socketClient;
            await this.viewConsumer.consume(this.socketClient, payload?.id);
        } catch (error) {
            this.logService.logError(error);
        }
    }

    handleDisconnect() {
        try {
            setTimeout(() => {
                delete this.gameData.viewPlayers[this.socketClient.id];
            });
        } catch (error) {
            this.logService.logError(error);
        }
    }

    verify() {
        return true;
    }
}
