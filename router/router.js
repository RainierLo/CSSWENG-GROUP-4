const express = require('express');
const router = require('express').Router();
const foodController = require('../controller/foodController');
const userController = require('../controller/userController');
const reviewsController = require('../controller/reviewsController');
const authSession = require('../middleware/authSession');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

const app = express();
/* GET Requests */
app.get('/', userController.getIndex);
app.get('/register', userController.getRegister);
app.get('/login', userController.getLogin);
app.get('/logout', userController.getLogout);
app.get('/checkUsername', userController.checkUsername);
app.get('/checkEmail', userController.checkEmail);
app.get('/checkOut', authSession.checkIfLoggedIn, userController.getCheckOut);
app.get('/getUserCart', userController.getUserCart);
app.get('/getMenu', foodController.getMenu);
app.get('/getBundle', foodController.getBundle);
app.get('/menu', foodController.getMenuPage);
app.get('/menu/bundlemeals', foodController.getBundleMeals);
app.get('/menu/:itemID', foodController.getIndivItemPage);
app.get('/getAdminMenu', foodController.getAdminMenu);
app.get('/getOrders', userController.getOrders);
app.get('/getUserOrder', userController.getUserOrder);
app.get('/getUsers', userController.getUsers);
app.get('/account/:userID', authSession.checkIfLoggedIn, userController.getAccountPage);
app.get('/admin', authSession.checkIfLoggedIn, userController.getAdmin);
app.get('/ourStory', userController.getOurStoryPage);
app.get('/reviews', userController.getReviewsPage)
app.get('/getReviews', reviewsController.getReviews);

/* POST Requests */
app.post('/', authSession.checkIfLoggedIn, userController.postAddtoCart);
app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);
app.post('/updateCart', userController.updateUserCart);
app.post('/removeCartItem', userController.remOneItem);
app.post('/editaccount', userController.updateOneUser)
app.post('/submitOrder', userController.createOrder);
app.post('/admin/addFood', upload.single('Picture'), foodController.addFood)
app.post('/admin/removeUser/:userID', userController.remOneUser);
app.post('/admin/removeItem/:itemID', foodController.removeItem);
app.post('/admin/updateOrderStatus', userController.updateOrderStatus);
app.post('/admin/updateItem/:itemID', upload.single('Picture'), foodController.updateItem);
app.post('/admin/removeReview/:reviewID', reviewsController.remOneReview);
app.post('/addReview', authSession.checkIfLoggedIn, reviewsController.addReview);


module.exports = app;