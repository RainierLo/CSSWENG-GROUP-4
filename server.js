
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
const http = require('http').Server(app);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname + '/views'));

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json());

dotenv.config();

port = process.env.PORT;
hostname = process.env.HOSTNAME;
uri = process.env.URI;

const { Server } = require('socket.io');
const io = new Server(http);

app.use(express.static(path.join(__dirname + "/public")));

app.use(session({
    'secret': 'secret',
    'resave': false,
    'saveUninitialized': false,
}));

const router = require('./router/router.js');
app.use('/', router);


mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Atlas Connected!");

    var orderCollection = connection.db.collection('orders');
    var orderStream = orderCollection.watch();

    var userCollection = connection.db.collection('users');
    var userStream = userCollection.watch();
    io.on('connection', socket => {
        //Waits for the 'users' collection to be updated for changes
        userStream.on('change', change => {
            socket.emit('userdb-updated', change);
        });
        //Waits for the 'orders' collection to be updated for changes
        orderStream.on('change', change => {
            socket.emit('orderdb-updated', change);
        });
    })
});

http.listen(port, hostname, function () {
    console.log(`Server running at: `);
    console.log(`http://` + hostname + `:` + port);
});


