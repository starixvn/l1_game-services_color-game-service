import { Core, Constants } from "sc-game-base";

export default class UserSignInConsumer extends Core.BaseEventConsumers.UserSignInConsumer {    
    constructor(definition, gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, userInfosRepository) {
        super(gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, userInfosRepository);

        this.definition = definition;
    }

    async consume(socketClient, payload) {
        if (payload?.system === Constants.Systems.Mobi || payload?.system === Constants.Systems.Mini) {
            await super.consume(socketClient, payload);
            return;
        }

        if (this.isEnable()) {
            await super.consume(socketClient, payload);
        } else {
            this.userSignInPublisher.publishUmNotice(socketClient, this.gameData.umMessages);
        }
    }

    handleSignInSuccess(socketClient, userInfo, userSession) {
        super.handleSignInSuccess(socketClient, userInfo, userSession);

        if(this.isEnable()){
            this.userSignInPublisher.publishToGameMessage(socketClient, this.definition.name);
        }
    }

    isEnable(){
        const configs = this.gameData.gameConfigs;
        const configuredlyDisabled = !configs || !configs.enabled;
        const disabled = configuredlyDisabled || this.gameData.delayStartTime > 0;

        return !disabled;
    }
}
