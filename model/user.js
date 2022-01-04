const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserType: { type: String },
    Email: { type: String, required: true },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    MobileNumber: { type: String },
    DateJoined: { type: String },
    OrdersMade: { type: Number },
    Cart: [
        {
            ItemID: {
                type: Schema.Types.ObjectId,
                ref: 'Food'
            },
            Quantity: { type: Number }
        },
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;