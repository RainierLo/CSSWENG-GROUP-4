const Food = require('../model/food');
const mongoose = require('mongoose');

exports.addFood = (req, res) => {
    const { FoodName, Price, Description } = req.body;

    const newFood = new Food({
        FoodName: FoodName,
        Price: Price,
        Description: Description,
        isAvailable: true
    });
    newFood
        .save()
        .then(() => res.json(`${FoodName} added to the Menu!`))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.getMenu = (req, res) => {
    Food
        .find()
        .then(menu => res.json(menu))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.updateItem = (req, res) => {
    const { itemID } = req.params;
    var id = mongoose.Types.ObjectId(itemID);

    const { FoodName, Price, Description, isAvailable} = req.body;
    const update = {
        FoodName: FoodName,
        Price: Price, 
        Description: Description,
        isAvailable: isAvailable
    }

    Food
        .updateOne({ _id: id }, update)
        .then(() => res.json(`Item ${FoodName} has been updated!`))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.deleteItem = (req, res) => {
    const { itemID } = req.params;
    const { FoodName } = req.body;
    var id = mongoose.Types.ObjectId(itemID);


    Food
        .findOneAndRemove({ _id: id })
        .then(() => res.json(`Item ${FoodName} has been deleted.`))
        .catch(err => res.status(400).json('Error: ' + err));
}