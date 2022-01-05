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


app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);
app.post('/removeCartItem', userController.remOneItem);
//Render routes to be added




module.exports = app;