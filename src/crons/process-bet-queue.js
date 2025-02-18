import { Crons } from "sc-rebet-mode";
export default class ProcessBetQueue extends Crons.TableProcessBetQueueSeparateBetLog {
    isCountOnTotalBets(player) {
        return this.gameData.currencies.some(
            (currency) =>
                currency.partnerId === player.session.operatorId &&
                currency.name === player.session.currencyName &&
                !(currency.isTest && currency.isUncountOnTotal)
        );
    }
}