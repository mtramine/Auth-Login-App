const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

const app = express();

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connectée'))
    .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');
app.get("/", (res, req) => {
    req.render("index");
});

// cookieParser
app.use(cookieParser());

// Bodyparser
app.use(express.urlencoded({ extended: false }))

 // Routes
 app.use('/', require('./routes/index'));
 app.use('/login', require('./routes/login'));
 app.use('/register', require('./routes/register'));
 app.use('/users', require('./routes/users'));

// Create server
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));