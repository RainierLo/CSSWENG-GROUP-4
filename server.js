const http = require('http');
const dotenv = require('dotenv');
const fs = require('fs');
const url = require('url');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require(`body-parser`);

const app = express();
app.set('view-engine', 'hbs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

port = process.env.PORT;
hostname = process.env.HOSTNAME;
uri = process.env.URI;

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Atlas Connected!");
});

app.use(express.static(__dirname + "/public"));

const router = require('./router/router.js');
app.use('/', router);


app.listen(port, hostname, function () {
    console.log(`Server running at: `);
    console.log(`http://` + hostname + `:` + port);
});



