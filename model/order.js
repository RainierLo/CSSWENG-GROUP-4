const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    User: { 
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Address: { type: String, required: true },
    Cart: [{
        type: Schema.Types.ObjectId,
        ref: "Food"
    }],
    TotalPrice: { type: Number, required: true },
    Status: { type: String }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;