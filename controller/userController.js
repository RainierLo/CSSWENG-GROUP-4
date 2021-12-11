const User = require('../model/user');
const Food = require('../model/food');
const bcrypt = require('bcrypt');

const userController = {
    getRegister: function(req, res) {
        //res.render('');
    },

    postRegister: async function(req, res) {
        try {
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            pass = hash_pass;
            const today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const newUser = new User({
                UserType: "Customer",
                Username: req.body.name,
                Email: req.body.email,
                Password: pass,
                DateJoined: date,
                OrdersMade: 0,
                Cart: [],
            });
            newUser.save()

            //res.redirect('/login');
        } catch {
            //res.status(500).send();
        }
    },

    checkEmail: function (req, res) {
        const { Email } = req.query;
        User.findOne({Email: Email}, function(err, result) {
            res.send(result);
        });
    }, 

    getLogin: function (req, res) {
        //res.render('');
    },
    
    postLogin: function (req, res) {
        const { Email, Password } = req.body;
        //Check Email 
        User.findOne( { Email: Email}, async function(err, user) {
            var IsPasswordCorrect = false;
            if (err) {
                return res.status(500).json({ message: err });
            } else if (user) {
                IsPasswordCorrect = await bcrypt.compare(Password, user.Password);
                if (IsPasswordCorrect) {
                    //render main page
                }
                    
            }
            //Else, invalid credentials
            res.send(IsPasswordCorrect);
            
        });
    }
}

// exports.getUsers = (req, res) => {

//     User
//         .find({ UserType: "Customer" })
//         .populate('Cart')
//         .then(users => res.json(users));
// }

module.exports = userController;