const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');

const bodyParser = require('body-parser') // Must be placed before router
const managerRouter = require('./routers/managerRouter.js');
const transcapRouter = require('./routers/transcapRouter.js');

const app = express();

// Connect to mongodb
mongoose.connect('mongodb://localhost/magicpost', { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("Connected to db"))
    .catch((err) => console.log(err));
mongoose.Promise = global.Promise;

// Port
app.listen(3000);

// Middleware and static files
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


// Pass json data to the request object
app.use(bodyParser.json())

app.use(session({
    secret: 'peter', 
    resave: false,
    saveUninitialized: true,
}));

// Manager Router
app.use('/manager', managerRouter);

// Transcap Router
app.use('/transcap', transcapRouter);

// 404 page
app.use((req, res, err) => {
    res.status(404).send({error: "Page not Found"})
})