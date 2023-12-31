"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../middleware/generateToken"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const signup = async (req, res) => {
    try {
        const { username, password, fName, lName } = req.body;
        if (!username || !password || !fName || !lName)
            return res
                .status(400)
                .send({ message: "All Inputs are required" });
        const potentialUser = await userModel_1.default.findOne({ username });
        if (potentialUser) {
            return res
                .status(400)
                .json({ message: 'User Already Exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await userModel_1.default
            .create({
            username,
            password: hashedPassword,
            fName,
            lName
        });
        const { isAdmin, _id } = user;
        await cartModel_1.default.create({
            userId: _id
        });
        const payload = {
            username,
            fName,
            lName,
            isAdmin,
            _id
        };
        const token = (0, generateToken_1.default)(payload);
        res
            .status(200)
            .cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
            .json({ message: "Account Created" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: 'An error occured.Please try again later.' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(400)
                .send({ message: "All Inputs are required" });
        const user = await userModel_1.default.findOne({ username });
        if (!user)
            return res
                .status(400)
                .json({ message: "User Does not exist" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res
                .status(400)
                .json({ message: "Incorrect Credentials" });
        const { fName, lName, isAdmin, _id } = user;
        const payload = {
            fName,
            lName,
            username,
            isAdmin,
            _id,
        };
        const token = (0, generateToken_1.default)(payload);
        res
            .status(200)
            .cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        })
            .json({ message: "Succesfully logged in", fName });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "A Problem Occured" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res
            .clearCookie('token')
            .json({ message: 'Logged out' });
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ message: "Sorry an error occured" });
    }
};
exports.logout = logout;
