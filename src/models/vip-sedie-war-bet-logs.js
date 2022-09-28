import mongoose from "mongoose";

const betLogSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    time: { type: Date },

    siteId: { type: String },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },

    currency: { type: String, required: true },
    rate: { type: Number, required: true },

    playerId: { type: Number },
    operatorId: { type: String, required: false },
    roundId: { type: Number, default: 0 },
});

export default mongoose.model("VipSedieWar_cuoc", betLogSchema);
