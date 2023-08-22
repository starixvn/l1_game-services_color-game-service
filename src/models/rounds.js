import mongoose from "mongoose";

const modelName = "colorgame_rounds";

const resultSchema = new mongoose.Schema(
    {
        dice1: { type: Number },
        dice2: { type: Number },
        dice3: { type: Number },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        yellow: { type: Boolean, default: false },
        red: { type: Boolean, default: false },        
        pink: { type: Boolean, default: false },
        white: { type: Boolean, default: false },
        blue: { type: Boolean, default: false },        
        green: { type: Boolean, default: false },
        hot: { type: Boolean, default: false },
        cold: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, required: true },
});

export default mongoose.model(modelName, Schema);
