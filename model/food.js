const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    FoodName: { type: String, required: true },
    Price: { type: Number, required: true }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;