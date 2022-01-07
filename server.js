const http = require('http');
const dotenv = require('dotenv');
const fs = require('fs');
const url = require('url');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require(`body-parser`);
const hbs = require('hbs');
const session = require('express-session');
const path = require('path');

const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

port = process.env.PORT;
hostname = process.env.HOSTNAME;
uri = process.env.URI;

const io = require('socket.io')(3000, {
    cors: {
        origin: '*',
    }
});
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Atlas Connected!");

    orderCollection = connection.db.collection('orders');
    orderStream = orderCollection.watch();

    io.on('connection', socket => {
        
        //Waits for the 'orders' collection to be updated for changes
        orderStream.on('change', change => {
            socket.emit('orderdb-updated', change);
        });
    })
});

app.use(express.static(__dirname + "/public"));

app.use(session({
    'secret': 'secret',
    'resave': false,
    'saveUninitialized': false,
}));

const router = require('./router/router.js');
app.use('/', router);


app.listen(port, hostname, function () {
    console.log(`Server running at: `);
    console.log(`http://` + hostname + `:` + port);
});



