import mongoose from "mongoose";

const handResultSchema = new mongoose.Schema(
    {
        red1: { type: Boolean, required: true },
        red2: { type: Boolean, required: true },
        red3: { type: Boolean, required: true },
        red4: { type: Boolean, required: true },
    },
    { _id: false }
);

const resultSchema = new mongoose.Schema(
    {
        banker: handResultSchema,
        player: handResultSchema,
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        player: { type: Boolean, default: false },
        banker: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },

        playerOdd: { type: Boolean, default: false },
        playerEven: { type: Boolean, default: false },
        playerRed3: { type: Boolean, default: false },
        playerRed4: { type: Boolean, default: false },
        playerWhite3: { type: Boolean, default: false },
        playerWhite4: { type: Boolean, default: false },

        bankerOdd: { type: Boolean, default: false },
        bankerEven: { type: Boolean, default: false },
        bankerRed3: { type: Boolean, default: false },
        bankerRed4: { type: Boolean, default: false },
        bankerWhite3: { type: Boolean, default: false },
        bankerWhite4: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date },
});

export default mongoose.model("VipSedieWar_phien", Schema);
