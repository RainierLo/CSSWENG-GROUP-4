const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    FoodName: { type: String, required: true },
    Price: { type: Number, required: true },
    Description: { type: String },
    Category: {type: String, enum: ['Appetizer, Meat, Vegetable, Seafood, Drinks, Other']},
    isAvailable: { type: Boolean, required: true },
    ImagePath: {type: String, required: true },
});


const Food = mongoose.model('Food', foodSchema);

module.exports = Food;