export default class ViewConsumer {
    constructor(definition, gameData, roundQuery, publisher, getBalance, userInfosRepository) {
        this.definition = definition;
        this.gameData = gameData;
        this.roundQuery = roundQuery;
        this.publisher = publisher;
        this.getBalance = getBalance;
        this.userInfosRepository = userInfosRepository;
    }

    async consume(socketClient, id) {
        const { remainingTime, gameConfigs, umMessages, delayStartTime } = this.gameData;
        const disabled = !gameConfigs || !gameConfigs.enabled || delayStartTime > 0;

        if (disabled) {
            socketClient.emit(this.definition.name, { remainingTime, um: disabled, um_message: umMessages });
        } else {
            const payload = await this.buildPayload();
            socketClient.emit(this.definition.name, { [id]: payload });
        }
    }

    async buildPayload() {
        const { odds, originalOdds, enableFreeBet, boostedChoices } = this.gameData.gameConfigs;
        const { totalBets, roundId, remainingTime } = this.gameData;
        const gameConfigs = { odds, originalOdds, enableFreeBet, boostedChoices };
        const roundHistory = await this.roundQuery.getList(this.definition.numberOfRoundHistory);

        return {
            remainingTime,
            roundId,
            gameConfigs,
            roundHistory,
            ownBets: {},
            totalBets,
        };
    }
}
