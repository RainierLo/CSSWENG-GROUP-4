const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Address: { type: String, required: true },
    Cart: [
        {
            FoodName: { type: String },
            Quantity: { type: Number }
        },
    ],
    TotalPrice: { type: Number, required: true },
    Status: { type: String }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;