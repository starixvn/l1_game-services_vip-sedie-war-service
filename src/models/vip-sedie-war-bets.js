import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    player: { type: Number },
    banker: { type: Number },
    tie: { type: Number },
    odd: { type: Number },
    even: { type: Number },

    playerOdd: { type: Number },
    playerEven: { type: Number },
    playerRed3: { type: Number },
    playerRed4: { type: Number },
    playerWhite3: { type: Number },
    playerWhite4: { type: Number },

    bankerOdd: { type: Number },
    bankerEven: { type: Number },
    bankerRed3: { type: Number },
    bankerRed4: { type: Number },
    bankerWhite3: { type: Number },
    bankerWhite4: { type: Number },

    totalAmount: { type: Number, default: 0 },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    currency: { type: String, require: true },
    rate: { type: Number, require: true },

    playerId: { type: Number },
    operatorId: { type: String, required: false },
    roundId: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
});

export default mongoose.model("VipSedieWar_one", schema);
