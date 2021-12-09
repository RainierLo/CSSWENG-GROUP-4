const router = require('express').Router();

const userController = require('../controller/userController');

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/getUsers').get(userController.getUsers);

module.exports = router;