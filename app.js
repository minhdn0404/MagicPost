const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { render } = require('ejs');

const managerRouter = require('./routers/managerRouter.js');

const app = express();

// Connect to mongodb
mongoose.connect('mongodb://localhost/magicpost', { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("Connected to db"))
    .catch((err) => console.log(err));

// Port
app.listen(3000);

// Middleware and static files
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Register view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/manager');
})

app.get('/about', (req, res) => {    
    res.render('about', {title: 'About-Title'});
})

// Manager Router
app.use('/manager', managerRouter);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404-Title'})
})