import { helpers } from "sc-common";
import { Table } from "sc-game-base";
import constants from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository, appConfigs) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.appConfigs = appConfigs;
        this.betChoiceRatio = { SpecificColor: 80, ColorGroup: 20};

        this.specificColorOpts = ["yellow", "red", "pink", "white", "blue", "green"];
        this.colorGroupOpts = ["hot", "cold"];
        this.hedgeBetGroups = [this.colorGroupOpts];
        this.smallTicketRatio = 70;
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            yellow: 0,
            red: 0,
            pink: 0,
            white: 0,
            blue: 0,
            green: 0,
            hot: 0,
            cold: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.specificColorOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.specificColorOpts) * 100) / totalBotBet < this.betChoiceRatio.SpecificColor,
            },
            {
                group: this.colorGroupOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.colorGroupOpts) * 100) / totalBotBet < this.betChoiceRatio.ColorGroup,
            },          
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.chance.pickone(underRatioGroups[0].group)
                : this.chance.pickone(this.specificColorOpts);

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

        if (this.specificColorOpts.includes(choice) || this.colorGroupOpts.includes(choice)) {
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
