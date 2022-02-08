const Reviews = require('../model/reviews');
const User = require('../model/user');

const reviewsController = {
    getReviews: async function (req, res) {
        Reviews
            .find()
            .populate({
                path: 'User',
                select: 'Username Email'
            })
            .exec(function (err, orders) {
                if (err) throw err
                if (orders) {
                    res.send(orders);
                }
            })
    },

    addReview: function (req, res) {
        userID = req.session.userID;
        const { review } = req.body;
        const newReview = new Reviews({
            User: userID,
            Review: review
        });

        newReview.save();

        res.redirect('/reviews')
    },

    remOneReview: function (req, res) {
        const { reviewID } = req.params;
        Reviews.findOneAndRemove({ _id: reviewID }, function (err, result) {
            if (err) throw err
            if (result) {
                res.send('Success');
            }
        });
    }
}

module.exports = reviewsController;