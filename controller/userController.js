const User = require('../model/user');
const Food = require('../model/food');
const Order = require('../model/order');
const Reviews = require('../model/reviews');
const bcrypt = require('bcrypt');

const userController = {
    getIndex: async function (req, res) {
        req.session.current_url = '/';

        try {
            var body = {};
            const menu = await Food.find({ isAvailable: true }).limit(10);
            body.Menu = menu
            if (req.session.username) {
                body.Username = req.session.username;
                body.id = req.session.userID;
            }
            res.render('index.hbs', body);
        } catch (err) {
            if (err) throw err;
        }
    },
    getRegister: function (req, res) {
        res.render('signup.hbs');
    },

    postRegister: async function (req, res) {
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
                MobileNumber: req.body.contactnumber,
                OrdersMade: 0,
                Cart: [],
            });
            newUser.save()

            res.redirect('/login');
        } catch (err) {
            if (err) throw err;
        }
    },

    checkUsername: function (req, res) {
        const { Username } = req.query;
        User.findOne({ Username: Username }, function (err, result) {
            res.send(result);
        });
    },

    checkEmail: function (req, res) {
        const { Email } = req.query;
        User.findOne({ Email: Email }, function (err, result) {
            res.send(result);
        });
    },

    getLogin: function (req, res) {
        res.render('login.hbs');
    },

    postLogin: function (req, res) {
        const { username, password } = req.body;
        if (username == "" || password == "") {
            var details = {
                error: 'Invalid Credentials'
            }
            res.render('login.hbs', details);
        } else {
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
                            req.session.userID = result._id;
                            req.session.username = result.Username;
                            var redirect_to = req.session.current_url;
                            if (result.UserType === 'Customer') {
                                if (redirect_to !== undefined)
                                    res.redirect(redirect_to)
                                else
                                    //If the current user is a customer
                                    res.redirect('/');
                            } else {
                                //For the admin / employee page
                                res.redirect('/admin');
                            }

                        } else {
                            var details = {
                                error: 'Invalid Credentials'
                            }
                            res.render('login.hbs', details);
                        }
                    });
                } else {
                    var details = {
                        error: 'Invalid Credentials'
                    }
                    res.render('login.hbs', details);
                }
            });
        }
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

    updateOneUser: async function (req, res) {
        try {
            const userID = req.session.userID;
            pw = req.body.password;
            const hash_pass = await bcrypt.hash(pw, 10);
            var userDetails = {
                Username: req.body.username,
                Password: hash_pass,
                MobileNumber: req.body.contactnumber
            };

            User.updateOne({ _id: userID },
                { $set: userDetails },
                function (err, result) {
                    if (err) throw err
                    if (result) {
                        console.log("Account updated.");
                        res.redirect('/login');
                    }
                });
        } catch (err) {
            if (err) throw err
        }
    },

    remOneUser: function (req, res) {
        const { userID } = req.params;

        removeUserOrders(userID);
        removeUserReviews(userID);
        User.findOneAndRemove({ _id: userID }, function (err, result) {
            if (err) throw err
            if (result) {
                res.send('Success');
            }
        });
    },

    getCheckOut: function (req, res) {
        req.session.current_url = '/checkOut';
        if (req.session.username) {
            var user = {
                Username: req.session.username,
                id: req.session.userID
            };
            res.render('checkout.hbs', user);
        } else {
            res.render('checkout.hbs');
        }
    },

    postAddtoCart: function (req, res) {
        const id = req.session.userID;
        const { itemID, Quantity } = req.body;
        var foodItem = {
            ItemID: itemID,
            Quantity: Quantity
        }

        User.updateOne({
            _id: id,
            Cart: {
                $not: {
                    $elemMatch: {
                        ItemID: itemID
                    }
                }
            }
        }, {
            $addToSet: {
                Cart: {
                    ItemID: itemID,
                    Quantity: Quantity
                }
            }
        }, { multi: true }, function (err, result) {
            if (err) throw err
            //If the foodItem is already in the cart, increment the quantity
            if (result.modifiedCount == 0) {
                User.updateOne({
                    _id: id,
                    Cart: {
                        $elemMatch: { ItemID: itemID }
                    }
                }, { $inc: { 'Cart.$.Quantity': Quantity } }, function (err, result2) {
                    if (err) throw err
                    if (result2) {
                        //Item is added to the User's cart
                        // res.send('Success');
                        console.log("Quantity Updated");
                    }
                })
            }
            res.redirect('/');
        })
    },

    getUserCart: function (req, res) {
        req.session.current_url = '/checkOut';
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
    },

    updateUserCart: function (req, res) {
        const id = req.session.userID;
        const { ItemID, Quantity } = req.body;

        User.updateOne({
            _id: id,
            Cart: { $elemMatch: { _id: ItemID } }
        }, { $inc: { 'Cart.$.Quantity': Quantity } }, function (err, result) {
            if (err) throw err
            if (result) {
                //Item is added to the User's cart
                res.send('Success');
            }
        })
    },

    remOneItem: function (req, res) {
        const id = req.session.userID;
        const { itemID } = req.body;
        User.updateOne({ _id: id }, { $pull: { Cart: { _id: itemID } } }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send('Success');
            }
        })
    },

    clearUserCart: function (req, res) {
        const id = req.session.userID;
        User.updateOne({ _id: id },
            { $set: { Cart: [] } }, function (err, result) {
                if (err) throw err
                if (result) {
                    res.redirect("/");
                }
            });
    },

    createOrder: function (req, res) {
        const id = req.session.userID;
        const { Address, City, Region, Zip } = req.body;

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const completeAddr = `${Address}, ${City}, ${Region}, ${Zip}`;
        var TotalPrice = 0;
        var Cart = [];
        var newOrder = new Order({
            User: id,
            Address: completeAddr,
            Status: 'Pending',
            DateOrdered: dateTime
        })
        getCart(id, function (cart) {
            cart.map(foodItem => {
                var item = {
                    FoodName: foodItem.ItemID.FoodName,
                    Quantity: foodItem.Quantity
                }
                TotalPrice += (foodItem.ItemID.Price * foodItem.Quantity);
                Cart.push(item);
            })
            newOrder.Cart = Cart;
            newOrder.TotalPrice = TotalPrice;
            newOrder.save();
        });
        clearUserCart(id);
        res.redirect('/');
    },
    getUserOrder: function (req, res) {
        Order.find({ User: req.session.userID }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send(result);
            }
        })
    },
    getOrders: function (req, res) {
        Order
            .find()
            .populate({
                path: 'User',
                select: 'Username Email MobileNumber'
            })
            .exec(function (err, orders) {
                if (err) throw err
                if (orders) {
                    res.send(orders);
                }
            })
    },

    updateOrderStatus: function (req, res) {
        const { orderID, userID, Status } = req.body;

        Order.updateOne({ _id: orderID }, { Status: Status }, function (err, result) {
            if (err) throw err;
            if (result) {
                if (Status == 'Completed') {
                    incOrderCompleted(userID);
                }
                res.send('Success');
            }
        })
    },
    getAccountPage: async function (req, res) {
        req.session.current_url = `/account/${req.session.userID}`;
        try {
            var user = await User.findOne({ _id: req.session.userID });
            var body = {
                Username: req.session.username,
                id: req.session.userID,
                DateJoined: user.DateJoined,
                Email: user.Email,
                MobileNumber: user.MobileNumber
            };

            res.render('viewProfile.hbs', body);
        } catch (err) {
            throw err;
        }

    },

    postEditAccount: async function (req, res) {
        try {
            const userID = req.session.userID;
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            var userDetails = {
                Username: req.body.username,
                Password: hash_pass,
                MobileNumber: req.body.contactnumber
            };

            User.updateOne({ _id: userID },
                { $set: userDetails },
                function (err, result) {
                    if (err) throw err
                    if (result) {
                        res.send('Success');
                    }
                });
        } catch (err) {
            throw err;
        }
    },

    getOurStoryPage: function (req, res) {
        req.session.current_url = '/ourStory';
        if (req.session.username) {
            var user = {
                Username: req.session.username,
                id: req.session.userID
            };
            res.render('ourstory.hbs', user);
        } else {
            res.render('ourstory.hbs');
        }
    },

    getReviewsPage: function (req, res) {
        req.session.current_url = '/reviews';
        if (req.session.username) {
            var user = {
                Username: req.session.username,
                id: req.session.userID
            };
            res.render('reviews.hbs', user)
        } else {
            res.render('reviews.hbs')
        }
    },
    // ADMIN CONTROLLER

    getAdmin: function (req, res) {
        req.session.current_url = '/admin';
        res.render('admin.hbs');
    }
}

function getCart(userID, callback) {
    User.findOne({ _id: userID })
        .select('Cart')
        .populate({
            path: 'Cart.ItemID',
            select: 'FoodName Price -_id'
        })
        .exec(function (err, Cart) {
            if (err) throw err
            if (Cart) {
                callback(Cart.Cart);
            }
        })
}

async function clearUserCart(userID) {
    await User.updateOne({ _id: userID }, { $set: { Cart: [] } });
    console.log("cart cleared")
}

async function removeUserOrders(userID) {
    await Order.deleteMany({ User: userID });
    console.log("Orders Removed");
}

async function removeUserReviews(userID) {
    await Reviews.deleteMany({ User: userID });
    console.log("Reviews Removed");
}

async function incOrderCompleted(userID) {
    await User.updateOne({ _id: userID }, { $inc: { OrdersMade: 1 } });
}

module.exports = userController;