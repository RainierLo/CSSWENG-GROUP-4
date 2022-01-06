const Food = require('../model/food');
const User = require('../model/user');
const mongoose = require('mongoose');

const foodController = {
    getMenuPage: function (req, res) {
        res.render('menu.ejs');
    },
    // postMenuPage: function (req, res) {

    // },

    getIndivItemPage: function (req, res) {
        const { itemID } = req.params;

        // Food.findOne( {_id: itemID }, function (err, result) {
        //     if (err) throw err
        //     if (result) {
        //         res.render('indivitem.hbs', result)
        //     }
        // })
        res.render('indivitem.hbs')
    },

    addFood: function (req, res) {
        const { FoodName, Price, Description } = req.body;
        const newFood = new Food({
            FoodName: FoodName,
            Price: Price,
            Description: Description,
            isAvailable: true
        });
        newFood.save(function (err) {
            if (err) throw err
            else
                res.send('Success');
        });
    },

    getMenu: function (req, res) {
        Food.find(function (err, menu) {
            if (err) throw err;
            if (menu) {
                res.send(menu);
            }

        });
    },

    updateItem: function (req, res) {
        const { itemID, FoodName, Price, Description, isAvailable } = req.body;
        const update = {
            FoodName: FoodName,
            Price: Price,
            Description: Description,
            isAvailable: isAvailable
        };

        Food.updateOne({ _id: itemID }, update, function (err, update) {
            if (err) throw err;
            if (update) {
                res.send('Success');
            }
        });
    },

    removeItem: function (req, res) {

        const { itemID } = req.params;
        Food.findOneAndRemove({ _id: itemID }, function (err, result) {
            if (err) throw err
            if (result) {
                res.send('Sucess');
            }
        });

    }
}

module.exports = foodController;
// exports.addFood = (req, res) => {
//     const { FoodName, Price, Description } = req.body;

//     const newFood = new Food({
//         FoodName: FoodName,
//         Price: Price,
//         Description: Description,
//         isAvailable: true
//     });
//     newFood
//         .save()
//         .then(() => res.json(`${FoodName} added to the Menu!`))
//         .catch(err => res.status(400).json('Error: ' + err));
// }

// exports.getMenu = (req, res) => {
//     Food
//         .find()
//         .then(menu => res.json(menu))
//         .catch(err => res.status(400).json('Error: ' + err));
// }

// exports.updateItem = (req, res) => {
//     const { itemID } = req.params;
//     var id = mongoose.Types.ObjectId(itemID);

//     const { FoodName, Price, Description, isAvailable} = req.body;
//     const update = {
//         FoodName: FoodName,
//         Price: Price,
//         Description: Description,
//         isAvailable: isAvailable
//     }

//     Food
//         .updateOne({ _id: id }, update)
//         .then(() => res.json(`Item ${FoodName} has been updated!`))
//         .catch(err => res.status(400).json('Error: ' + err));
// }

// exports.deleteItem = (req, res) => {
//     const { itemID } = req.params;
//     const { FoodName } = req.body;
//     var id = mongoose.Types.ObjectId(itemID);


//     Food
//         .findOneAndRemove({ _id: id })
//         .then(() => res.json(`Item ${FoodName} has been deleted.`))
//         .catch(err => res.status(400).json('Error: ' + err));
// }

// exports.addToCart = (req, res) => {
//     const { userID } = req.body;
//     const { itemID } = req.params;

//     User
//         .updateOne(
//             { _id: userID },
//             { $addToSet: { Cart: itemID } }
//         )
//         .then(() => res.json("Item added to cart!"))
//         .catch(err => res.status(400).json('Error: ' + err));
// }