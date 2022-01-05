

const authSession = {
    //Middleware to see if the user is currently logged in
    checkIfLoggedIn: function (req, res, next) {
        if (!req.session.userID) {
            req.session.redirect_to = req.session.current_url
            res.redirect('/login');
        } else {
            next();
        }
    }
}

module.exports = authSession;