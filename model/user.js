const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserType: { type: String },
    Email: {type: String, required: true},
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    DateJoined: { type: String },
    OrdersMade: { type: Number },
    Cart: [{
        type: Schema.Types.ObjectId,
        ref: "CartItem"
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;