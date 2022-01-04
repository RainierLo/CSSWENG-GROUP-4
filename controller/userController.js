const User = require('../model/user');
const Food = require('../model/food');
const bcrypt = require('bcrypt');

const userController = {
    getIndex: function (req, res) {
        if (req.session.username) {
            var user = {
                Username: req.session.username,
                id: req.session.id
            };
            res.render('index.hbs', user);
        } else {
            res.render('index.hbs');
        }
    },
    getRegister: function (req, res) {
        res.render('signup.hbs');

    },

    postRegister: async function (req, res) {

        console.log(req.body);
        try {
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            pass = hash_pass;
            const today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const newUser = new User({
                UserType: "Customer",
                Username: req.body.username,
                Email: req.body.email,
                Password: pass,
                DateJoined: date,
                OrdersMade: 0,
                Cart: [],
            });
            newUser.save()

            res.redirect('/login');
        } catch {
            //res.status(500).send();
        }
    },

    checkEmail: function (req, res) {
        const { Email } = req.query;
        User.findOne({ Email: Email }, function (err, result) {
            res.send(result);
        });
    },

    getLogin: function (req, res) {
        res.render('login.hbs');
        // res.sendFile('login.html', { root: 'views' });
    },

    postLogin: function (req, res) {
        const { username, password } = req.body;

        User.findOne({ Email: username }, async function (err, result) {

            if (err) {
                return res.status(500).json({ message: err });
            } else if (result) {

                var user = {
                    username: result.Username,
                    email: result.Email,
                    id: result._id
                };

                bcrypt.compare(password, result.Password, function (err, equal) {
                    if (equal) {
                        req.session.id = result._id;
                        req.session.username = result.Username;

                        if (result.UserType === 'Customer') {
                            //If the current user is a customer
                            res.redirect('/');
                        } else {
                            //For the admin / employee page
                            //res.redirect();
                        }

                    } else {
                        var details = {
                            error: 'Invalid Credentials'
                        }
                        res.render('login.hbs', details);
                    }
                });
            }
        });
    },

    getLogout: function (req, res) {
        req.session.destroy(function (err) {
            if (err) throw err;

            res.redirect('/');
        })
    },

    getUsers: function (req, res) {
        User.find({ UserType: 'Customer' }, function (err, users) {
            if (err) throw err;
            if (users) {
                res.send(users);
            }

        })
    },

    updateOneUser: function (req, res) {
        const userID = req.session.userID;
        
        var userDetails = {
            Email: req.body.email,
            Username: req.body.username,
            Password: req.body.password,
            MobileNumber: req.body.mobileNum
        };

        User.updateOne({ _id: userID }, 
            {$set: userDetails}, 
            function (err, result) {
            if (err) throw err
            if (result) {
                res.send('Success');
            }
        });
    },

    remOneUser: function (req, res) {
        const { userID } = req.params;
        User.findOneAndRemove({ _id: userID }, function (err, result) {
            if (err) throw err
            if (result) {
                res.send('Success');
            }
        });
    },
    postAddtoCart: function (req, res) {
        const id = req.session.userID;
        const { itemID, qty } = req.body;

        var foodItem = {
            ItemID: itemID,
            Quantity: qty
        }

        User.updateOne({ _id: id }, { $addToSet: { Cart: foodItem } }, function (err, result) {
            if (err) throw err
            if (result) {
                //Item is added to the User's cart
                res.send('Success');
            }
        })
    },

    getUserCart: function (req, res) {
        const id = req.session.userID;

        User.findOne({ _id: id })
            .select('Cart')
            .populate('Cart.ItemID')
            .exec(function (err, Cart) {
                if (err) throw err
                if (Cart) {
                    res.send(Cart);
                }
            })
    }
}

module.exports = userController;