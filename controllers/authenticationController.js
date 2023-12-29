import User from "../models/user.js";
import Blacklist from "../models/blacklist.js";
import bcrypt from "bcrypt";

function checkRole(role) {
    const roles = ["admin", "p-c_head", "p-s_head", "p-c_staff", "p-s_clerk", "none"];
    return roles.includes(role);
}

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    try {

        // create an instance of a user
        let newUser;
        const {role : _role} = req.body;
        if(req.check.isAdmin) {
            if(! (checkRole(_role))) {
                console.warn("[%s] Admin is trying to create a user with invalid role! : \"%s\"", Date.now().toLocaleString("vi"), _role);
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "Not a valid role",
                });
            }
            newUser = new User({
                username : req.body.username,
                password : req.body.password,
                role : _role
            });
        }
        if(req.check.isPSHEAD) {
            newUser = new User({
                username : req.body.username,
                password : req.body.password,
                role : "p-s_clerk"
            });
        }
        if(req.check.isPCHEAD) {
            newUser = new User({
                username : req.body.username,
                password : req.body.password,
                role : "p-c_staff"
            });
        }
        if(newUser === undefined) {
            console.warn("[%s] Someone without permission is trying to create a user!", Date.now().toLocaleString("vi"))
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Not have permission to create user",
            });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser){
            console.warn("[%s] User is trying to recreate an existing user", Date.now().toLocaleString("vi"))
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        }
        const savedUser = await newUser.save(); // save new user into the database
        const { password , role, ...user_data } = savedUser._doc;

        console.info("[%s] An user with username \"%s\" and role \"%s\" has been created", Date.now().toLocaleString("vi"), user_data.username, role);
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
        console.error(err)
    }
    res.end();
}

/**
 * @route POST v1/auth/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
    // Get variables for the login process
    try {
        // Check if user exists
        const user = await User.findOne({ username: req.body.username }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // if user exists
        // validate password
        const isPasswordValid = bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        let options = {
            maxAge: 12 * 60 * 60 * 1000, // would expire in 12 hours
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const {role , username } = user._doc;
        const accessToken = user.generateAccessJWT();

        const user_data = {
            username,
            role,
            token: accessToken
        }

        res.cookie(
            "SessionID",
            accessToken,
            options
        )
        console.info("[%s] An user with username \"%s\" and role \"%s\" has just login", Date.now().toLocaleString("vi"), user_data.username, role);
        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
        console.error(err)
    }
    res.end();
}

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
export async function Logout(req, res) {
    try {
        const authHeader = req.headers["authorization"]; // get the session cookie from request header

        if (!authHeader) return res.sendStatus(401)

        const accessToken = authHeader.replace('Bearer ', '');
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
        // if true, send a no content response.
        if (checkIfBlacklisted) return res.sendStatus(204);
        // otherwise blacklist token
        const newBlacklist = new Blacklist({
            token: accessToken,
        });
        await newBlacklist.save();
        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
        console.error(err)
    }
    res.end();
}