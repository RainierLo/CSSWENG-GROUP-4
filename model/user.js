const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserType: { type: String },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    DateJoined: { type: String },
    OrdersMade: { type: Number },
    Cart: [{
        type: Schema.Types.ObjectId,
        ref: "Food"
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;