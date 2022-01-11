const Food = require('../model/food');
const User = require('../model/user');
const mongoose = require('mongoose');
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const foodController = {
    // postMenuPage: function (req, res) {

    // },

    getIndivItemPage: function (req, res) {
        const { itemID } = req.params;

        // Check if logged in
        // if (req.session.username) {
            Food.findOne( {_id: itemID }, function (err, result) {
                if (err) throw err
                if (result) {
                    var body = {
                        Username: req.session.username,
                        Food: result
                    }
                    res.render('indivitem.hbs', body);
                }
            })
        // }
        // else {
        //     res.redirect('login.hbs');
        // }
        
    },

    getMenuPage: function (req,res) {
        res.render('menu.hbs');
    },

    addFood: function (req, res) {
        console.log(req.body.FoodName);
        const { FoodName, Price, Description, Category, Picture } = req.body;
        const newFood = new Food({
            FoodName: FoodName,
            Price: Price,
            Description: Description,
            Category: Category,
            isAvailable: true
        });

        saveImage(newFood, Picture);
        newFood.save(function (err) {
            if (err) throw err
            else
                // res.send('Success');
                res.redirect('/admin');
        });
    },

    getMenu: async function (req, res) {
        try {
            const menu = await Food.find().lean({ virtuals: true });
            res.send(menu);
        } catch (err) {
            if (err) throw err;
        }

    },

    updateItem: function (req, res) {
        const { itemID } = req.params;
        const { FoodName, Price, Description, Category, isAvailable } = req.body;
        const update = {
            FoodName: FoodName,
            Price: Price,
            Description: Description,
            Category: Category,
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

function saveImage(foodItem, encodedImg) {
    if (encodedImg == null) return;

    const image = JSON.parse(encodedImg);
    if (image != null && imageMimeTypes.includes(image.type)) {
        foodItem.Image = new Buffer.from(image.data, 'base64');
        foodItem.ImageType = image.type;
    }
}

module.exports = foodController;
