import { Core } from "sc-game-base";

export default class UserSignInConsumer extends Core.BaseEventConsumers.UserSignInConsumer {    
    constructor(definition, gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, userInfosRepository) {
        super(gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, userInfosRepository);

        this.definition = definition;
    }
    
    async consume(socketClient, payload) {
        const configs = this.gameData.gameConfigs;
        const configuredlyDisabled = !configs || !configs.enabled;
        const disabled = configuredlyDisabled || this.gameData.delayStartTime > 0;

        if (!disabled) {
            await super.consume(socketClient, payload);
        } else {
            this.userSignInPublisher.publishUmNotice(socketClient, this.gameData.umMessages);
        }
    }

    handleSignInSuccess(socketClient, userInfo, userSession) {
        super.handleSignInSuccess(socketClient, userInfo, userSession);

        this.userSignInPublisher.publishToGameMessage(socketClient, this.definition.name);
    }
}
