const express = require('express');
const router = require('express').Router();
const foodController = require('../controller/foodController');
const userController = require('../controller/userController');


const app = express();

app.get('/', userController.getIndex);
app.get('/register', userController.getRegister);
app.get('/login', userController.getLogin);
app.get('/logout', userController.getLogout);
app.get('/checkEmail', userController.checkEmail);
app.get('/checkOut', userController.getCheckOut);

app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);

//Render routes to be added




module.exports = app;