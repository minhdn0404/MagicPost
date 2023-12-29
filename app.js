import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { VerifyRole} from "./middleware/verifyRole.js";
import Verify from "./middleware/verifyAccessToken.js";
import authenticationRoute from "./routers/authenticationRoute.js";

import express from "express";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";

import bodyParser from "body-parser"
import managerRouter from "./routers/managerRouter.js";
import transcapRouter from "./routers/transcapRouter.js";
import gathercapRouter from "./routers/gathercapRouter.js";
import transstaffRouter from "./routers/transstaffRouter.js";
import gatherstaffRouter from "./routers/gatherstaffRouter.js";
import customerRouter from "./routers/customerRouter.js";
dotenv.config();
const { URI, PORT, SECRET_ACCESS_TOKEN } = process.env;

const app = express();

// Connect to mongodb
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log(err));
mongoose.Promise = global.Promise;

// Port
app.listen(PORT);

// Middleware and static files
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
// Manager Router
app.use('/manager', managerRouter);

app.get("/verify", Verify , (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the Admin portal!",
    });
});

app.get("/verifyrole", Verify , VerifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the Admin portal!",
    });
});

app.use("/auth", authenticationRoute);

app.use(session({
    secret: 'peter',
    resave: false,
    saveUninitialized: true,
}));

// Manager Router
app.use('/manager', managerRouter);

// Transcap Router
app.use('/transcap', transcapRouter);

// Gathercap router
app.use('/gathercap', gathercapRouter);

// Transstaff router
app.use('/transstaff', transstaffRouter);

// Gatherstaff router
app.use('/gatherstaff', gatherstaffRouter);

// Customer router
app.use('/customer', customerRouter);

// 404 page
app.use((req, res, err) => {
    res.status(404).send({error: "Page not Found"})
})

export {URI, PORT, SECRET_ACCESS_TOKEN, app};
