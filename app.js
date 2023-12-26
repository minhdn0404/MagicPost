const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const bodyParser = require('body-parser') // Must be placed before router
const managerRouter = require('./routers/managerRouter.js');

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

app.get('/', (req, res) => {
    res.redirect('/manager');
})

// Pass json data to the request object
app.use(bodyParser.json())

// Manager Router
app.use('/manager', managerRouter);

// 404 page
app.use((req, res, err) => {
    res.status(404).send({error: "Page not Found"})
})