const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    Item: {
        type: Schema.Types.ObjectId,
        ref: "Food"
    },
    Qty: { type: Number }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;