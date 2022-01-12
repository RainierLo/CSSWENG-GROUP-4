const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    FoodName: { type: String, required: true },
    Price: { type: Number, required: true },
    Description: { type: String },
    Category: {type: String},
    isAvailable: { type: Boolean, required: true },
    Image: {type: Buffer, required: true },
    ImageType: {type: String, required: true }
});

foodSchema.index({FoodName: 1, isAvailable: -1})
foodSchema.set('toObject', { virtuals: true })
foodSchema.set('toJSON', { virtuals: true })
foodSchema.plugin(mongooseLeanVirtuals);
foodSchema.virtual('imagePath').get(function () {
    if (this.Image != null && this.ImageType != null) {
        return `data:${this.ImageType};charset=utf-8;base64,${this.Image.toString('base64')}`
    }
})

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;