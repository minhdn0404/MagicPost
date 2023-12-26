import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../app.js";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: "Your username is required",
            max: 25,
        },
        password: {
            type: String,
            required: "Your password is required",
            select: false,
            max: 25,
        },
        role: {
            type: String,
            enum: ["admin", "p-c_head", "p-s_head", "p-c_staff", "p-s_clerk", "none"],
            required: true,
            default: "none",
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
        role: this.role,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '12h',
    });
};

export default mongoose.model("users", UserSchema);