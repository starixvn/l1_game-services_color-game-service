import { helpers } from "sc-common";
import { Table } from "sc-game-base";
import constants from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository, appConfigs) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.appConfigs = appConfigs;
        this.betChoiceRatio = { DragonTiger: 70, DragonColor: 14, TigerColor: 14, Tie: 2};

        this.dragonTigerOpts = ["dragon", "tiger"];
        this.dragonColorOpts = ["blackDragon", "redDragon"];
        this.tigerColorOpts = ["blackTiger", "redTiger"];
        this.tieOpts = ["tie"];
        this.hedgeBetGroups = [this.dragonTigerOpts];
        this.smallTicketRatio = 70;
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            dragon: 0,
            tiger: 0,
            tie: 0,
            blackDragon: 0,
            redDragon: 0,
            blackTiger: 0,
            redTiger: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.dragonTigerOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.dragonTigerOpts) * 100) / totalBotBet < this.betChoiceRatio.DragonTiger,
            },
            {
                group: this.dragonColorOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.dragonColorOpts) * 100) / totalBotBet <
                    this.betChoiceRatio.DragonColor,
            },
            {
                group: this.tigerColorOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.tigerColorOpts) * 100) / totalBotBet < this.betChoiceRatio.TigerColor,
            },
            {
                group: this.tieOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.tieOpts) * 100) / totalBotBet < this.betChoiceRatio.Tie,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.chance.pickone(underRatioGroups[0].group)
                : this.chance.pickone(this.dragonTigerOpts);

        const hedgeBetGroup = this.hedgeBetGroups.find(group => group.includes(choice));
        if(hedgeBetGroup){
            const oppositeChoice = choice === hedgeBetGroup[0] ? hedgeBetGroup[1] : hedgeBetGroup[0];
            return bot.choices.includes(oppositeChoice) ? oppositeChoice : choice;
        }
        else{
            return choice;
        }
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        const maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.dragonTigerOpts.includes(choice) || this.dragonColorOpts.includes(choice) || this.tigerColorOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3);
            return isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.min(minBet * 10, maxBet * 0.2);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += (amount <= this.getMinBet() * 50) ? 1 : 0;
    }

    convertAmountToChip(amount) {
        const chipList = constants.botChips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }

    getBotsToBet() {
        const maxTickets = Math.floor(Object.keys(this.botsInRoom).length / this.gameData.remainingTime) + 5;
        const numberBotsToBet = this.chance.integer({ min: 5, max: maxTickets });

        let botsToBet = Object.values(this.botsInRoom).filter(
            (t) => t.totalBet < this.gameData.gameConfigs.bot_maxbet && t.remainTickets > 0
        );

        botsToBet = this.chance.shuffle(botsToBet);

        return botsToBet.slice(0, Math.min(numberBotsToBet, botsToBet.length));
    }

    shouldAddBot(random) {
        return random === this.inOutValues.in && Object.keys(this.botsInRoom).length < this.maxNumberOfBots;
    }
}
