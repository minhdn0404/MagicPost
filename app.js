import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { VerifyRole} from "./middleware/verifyRole";
import Verify from "./middleware/verifyAccessToken";
import authenticationRoute from "./routers/authenticationRoute";

const { URI, PORT, SECRET_ACCESS_TOKEN } = process.env;
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const { render } = require('ejs');

const managerRouter = require('./routers/managerRouter.js');

const app = express();

// Connect to mongodb
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("Connected to db"))
    .catch((err) => console.log(err));

// Port
app.listen(PORT);

// Middleware and static files
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

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

app.get("/verify", Verify, VerifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the Admin portal!",
    });
});

app.use("/auth", authenticationRoute);

export {URI, PORT, SECRET_ACCESS_TOKEN, app};