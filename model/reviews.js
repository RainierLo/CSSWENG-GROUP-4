const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Review: { type: String, required: true },
});

const Reviews = mongoose.model('Reviews', reviewsSchema);

module.exports = Reviews;