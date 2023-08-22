import { Core } from "sc-game-base";

export default class HistoryQuery extends Core.QueryApis.HistoryQuery{
    getBetLogDetails(player, roundId) {
        return this.betLogsRepository
            .find(
                { roundId, uid: player.UID },
                { __v: false, _id: false, name: false, uid: false, operatorId: false, currency: false, playerId: false, siteId: false },
                { sort: { _id: -1 } }
            )
            .lean()
            .exec();
    }
}

