const User = require('../model/user');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
    //Checks the database first if the username is taken
    User.exists({ Username: req.body.Username }, async function (err, result) {
        var pass;
        if (err) throw err;

        if (result) {
            res.status(400).json("Username is already in use.");
        } else {
            try {
                const hash_pass = await bcrypt.hash(req.body.Password, 10);
                pass = hash_pass;
            } catch {
                res.status(500).send();
            }
            //result will return false if the user does not exist yet
            //If the username is available, it is added to the database
            if (!result) {
                const today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const newUser = new User({
                    UserType: "Customer",
                    Username: req.body.Username,
                    Password: pass,
                    DateJoined: date,
                    OrdersMade: 0,
                    Cart: [],
                });
                newUser
                    .save()
                    .then(() => res.json('User Added!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                res.status(400).json("Username is already in use.");
            }
        }
    });
}

//Login
exports.login = (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password)
        return res.status(400).json({ message: 'Please fill out all fields' });


    User.findOne({ Username: Username }, async function (err, user) {
        if (err) {
            res.status(500).json({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        try {
            var IsPasswordCorrect = await bcrypt.compare(Password, user.Password);

            if (!IsPasswordCorrect) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            console.log(`Password - ${IsPasswordCorrect}`);
            res.send("Login Successful!");
        } catch {
            res.status(500).send();
        }
    })
}

// exports.addUser = (req, res) => {
//     const {Username, Password} = req.body;
//     // console.log(req.body);
//     UserType = "Customer";
//     const newUser = new User ({
//         UserType: UserType,
//         Username: Username,
//         Password: Password
//     });

//     newUser
//         .save()
//         .then(() => res.json('User Added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// }

exports.getUser = (req, res) => {
    User
        .find({ UserType: "Customer" })
        .then(users => res.json(users));
}