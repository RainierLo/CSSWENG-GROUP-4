const express = require('express');
const router = require('express').Router();
const foodController = require('../controller/foodController');
const userController = require('../controller/userController');
const authSession = require('../middleware/authSession');

const app = express();

app.get('/', userController.getIndex);
app.get('/register', userController.getRegister);
app.get('/login', userController.getLogin);
app.get('/logout', userController.getLogout);
app.get('/checkEmail', userController.checkEmail);
app.get('/checkOut', authSession.checkIfLoggedIn, userController.getCheckOut);
app.get('/getUserCart', userController.getUserCart);
app.get('/getMenu', foodController.getMenu);
app.get('/menu/:itemID', foodController.getIndivItemPage);
app.get('/admin/orders', userController.getOrderPage)
app.get('/getOrders', userController.getOrders);

app.post('/', authSession.checkIfLoggedIn, userController.postAddtoCart);
app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);
app.post('/updateCart', userController.updateUserCart);
app.post('/removeCartItem', userController.remOneItem);
app.post('/addFood', foodController.addFood);
app.post('/submitOrder', userController.createOrder);

//Render routes to be added




module.exports = app;