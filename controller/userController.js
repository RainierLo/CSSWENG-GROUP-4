const User = require('../model/user');
const Food = require('../model/food');
const Order = require('../model/order');
const bcrypt = require('bcrypt');

const userController = {
    getIndex: function (req, res) {
        req.session.current_url = '/';
        Food.find(function (err, menu) {
            if (err) throw err
            if (menu) {
                if (req.session.username) {
                    var user = {
                        Username: req.session.username,
                        id: req.session.id,
                        Menu: menu
                    };
                    res.render('index.hbs', user);
                } else {
                    var param = {
                        Menu: menu
                    }
                    res.render('index.hbs', param);
                }
            }
        })
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
        if (username.length == 0 || password.length == 0) {
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
                            var redirect_to = req.session.redirect_to;
                            if (result.UserType === 'Customer') {
                                if (redirect_to !== undefined)
                                    res.redirect(redirect_to)
                                else
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

    updateOneUser: function (req, res) {
        const userID = req.session.userID;

        var userDetails = {
            Email: req.body.email,
            Username: req.body.username,
            Password: req.body.password,
            MobileNumber: req.body.mobileNum
        };

        User.updateOne({ _id: userID },
            { $set: userDetails },
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

    getCheckOut: function (req, res) {
        req.session.current_url = '/checkOut';
        if (req.session.username) {
            var user = {
                Username: req.session.username,
                id: req.session.id
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
        // User.updateOne({ _id: id }, { $addToSet: { Cart: foodItem } }, function (err, result) {
        //     if (err) throw err
        //     if (result) {
        //         //Item is added to the User's cart
        //         // res.send('Success');
        //         res.redirect('/');
        //     }
        // })
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
            //Cart: { $elemMatch: { ItemID: ItemID} }
            Cart: { $elemMatch: { _id: ItemID } }
        }, { $inc: { 'Cart.$.Quantity': Quantity } }, function (err, result) {
            if (err) throw err
            if (result) {
                //Item is added to the User's cart
                // res.send('Success');
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
                    res.send("Success");
                }
            });
    },
    getOrderPage: function (req, res) {
        res.render('TESTorders.hbs');
    },
    createOrder: function (req, res) {
        const id = req.session.userID;
        const { Address, City, Region, Zip } = req.body;

        const completeAddr = `${Address}, ${City}, ${Region}, ${Zip}`;
        var TotalPrice = 0;
        var Cart = [];
        var newOrder = new Order({
            User: id,
            Address: completeAddr,
            Status: 'Pending'
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

module.exports = userController;