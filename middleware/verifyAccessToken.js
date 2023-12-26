import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import {SECRET_ACCESS_TOKEN} from "../app.js";
import Blacklist from "../models/blacklist.js";

export async function Verify(req, res, next) {
    const authHeader = req.headers["authorization"]; // get the session cookie from request header

    if (!authHeader) return res.sendStatus(401)

    const accessToken = authHeader.replace('Bearer ', '');
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
    // if true, send an unathorized message, asking for a re-authentication.
    if (checkIfBlacklisted){
        console.error("[%s] An user has just tried to access a blacklisted token : \"%s\"", Date.now().toLocaleString("vi"), accessToken);
        return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
    }
    // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            // if token has been altered, return a forbidden error
            console.error("[%s] An user has just tried to access a tampered token with token \"%s\"", Date.now().toLocaleString("vi"), accessToken);
            return res
                .status(401)
                .json({ message: "This session has expired. Please login" });
        }

        const { id } = decoded; // get user id from the decoded token
        const user = await User.findById(id); // find user by that `id`
        const { password, ...data } = user._doc; // return user object but the password
        req.user = data; // put the data object into req.user
        next();
    });
}

export default Verify;