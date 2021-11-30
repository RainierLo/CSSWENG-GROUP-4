const router = require('express').Router();

const foodController = require('../controller/foodController');

router.route('/addItem').post(foodController.addFood);
router.route('/updateMenu/:itemID').post(foodController.updateItem);
router.route('/deleteItem/:itemID').post(foodController.deleteItem);

router.route('/getMenu').get(foodController.getMenu);
module.exports = router;
