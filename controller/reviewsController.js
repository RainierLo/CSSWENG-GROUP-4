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
    }
}

module.exports = reviewsController;