import express from "express";
import {Register, Login, Logout} from "../controllers/authenticationController.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import {RoleChecker} from "../middleware/roleChecker.js";
import Verify from "../middleware/verifyAccessToken.js";

const router = express.Router();

// Register route -- POST request
router.post(
    "/register",
    check("username")
        .not()
        .isEmpty()
        .withMessage("You first name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    Validate,
    Verify,
    RoleChecker,
    Register
);

router.post(
    "/login",
    check("username")
        .not()
        .isEmpty()
        .trim()
        .escape(),
    check("password").not().isEmpty(),
    Validate,
    Login
);

router.get('/logout', Logout);

export default router;