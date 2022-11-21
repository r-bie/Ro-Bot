const { Schema, model } = require('mongoose');
const salesSchema = new Schema({
    _id: Schema.Types.ObjectId,
    blockNumber: String,
    nftID: String,
    nftType: String,
});

module.exports = model("Sales", salesSchema, "sales");