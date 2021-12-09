const router = require('express').Router();



//Di pa final, will add render routes once we have the frontend files

const foodController = require('../controller/foodController');
const userController = require('../controller/userController');

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/getUsers').get(userController.getUsers);

router.route('/addItem').post(foodController.addFood);
router.route('/updateMenu/:itemID').post(foodController.updateItem);
router.route('/deleteItem/:itemID').post(foodController.deleteItem);
router.route('/addToCart/:itemID').post(foodController.addToCart);

router.route('/getMenu').get(foodController.getMenu);

module.exports = router;