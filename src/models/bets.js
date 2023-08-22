import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    yellow: { type: Number, default: 0 },
    red: { type: Number, default: 0 },    
    pink: { type: Number, default: 0 },
    white: { type: Number, default: 0 },
    blue: { type: Number, default: 0 },    
    green: { type: Number, default: 0 },
    hot: { type: Number, default: 0 },
    cold: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: Number },
    operatorId: { type: String },
    roundId: { type: Number, default: 0, required: true },
    paid: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "colorgame_bets",
    new mongoose.Schema({
        ...bet,
        currency: { type: String },
        rate: { type: Number, required: true },
    })
);
const tmpBets = mongoose.model("colorgame_tmpbets", new mongoose.Schema(bet));

export { bets, tmpBets };
