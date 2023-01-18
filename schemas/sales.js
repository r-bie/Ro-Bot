const { Schema, model } = require('mongoose');
const salesSchema = new Schema({
    _id: Schema.Types.ObjectId,
    blockchain: String,
    blockNumber: String,
    nftID: String,
    nftType: String,
    charLevel: String,
    charTrait: String,
    weapStars: String,
    weapTrait: String,
    salesType: String,
    salesPrice: String,
});

module.exports = model("Sales", salesSchema, "sales");