const Reviews = require('../model/reviews');
const User = require('../model/user');

const reviewsController = {
    getReviews: async function (req, res) {
        try {
            const reviews = await Reviews.find();
            res.send(reviews);
        } catch (error) {
            if (error) throw error;
        }
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
    }
}

module.exports = reviewsController;