"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.deleteUser = exports.changePassword = exports.updateUser = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../middleware/generateToken"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const addressModel_1 = __importDefault(require("../models/addressModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
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
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newUser } = req.body;
        const currentUser = await userModel_1.default.findById(userId);
        const usernameEquals = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) === newUser.username;
        const fNameEquals = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.fName) === newUser.fName;
        const lNameEquals = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.lName) === newUser.lName;
        if (usernameEquals && fNameEquals && lNameEquals) {
            return res
                .status(200)
                .json({ message: "Changes Saved" });
        }
        if (!usernameEquals) {
            const potentialUser = await userModel_1.default.findOne({ username: newUser.username });
            if (potentialUser && potentialUser._id.toString() !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser._id.toString())) {
                return res
                    .status(400)
                    .json({ message: "This username is already taken" });
            }
        }
        const updatedFields = {};
        if (!usernameEquals) {
            updatedFields.username = newUser.username;
        }
        if (!fNameEquals) {
            updatedFields.fName = newUser.fName;
        }
        if (!lNameEquals) {
            updatedFields.lName = newUser.lName;
        }
        const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true });
        const payload = updatedUser.toObject();
        const token = (0, generateToken_1.default)(payload);
        res
            .status(200)
            .clearCookie('token')
            .cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        })
            .json({ message: "Saved Changes", updatedUser });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "A Problem Occurred" });
    }
};
exports.updateUser = updateUser;
const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { securityPassword, newPassword } = req.body;
        if (!userId || !securityPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" });
        }
        const potentialUser = await userModel_1.default.findById(userId);
        const match = await bcrypt_1.default.compare(securityPassword, potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.password);
        if (!match)
            return res
                .status(400)
                .json({ message: "The Entered password does not match with your current password" });
        const updatedPassword = await bcrypt_1.default.hash(newPassword, 10);
        potentialUser.password = updatedPassword;
        await (potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.save());
        res
            .status(200)
            .json({ message: "Password changed successfully" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "A Problem Occured" });
    }
};
exports.changePassword = changePassword;
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { securityPassword } = req.body;
        const potentialUser = await userModel_1.default.findById(userId);
        const match = await bcrypt_1.default.compare(securityPassword, potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.password);
        if (!match)
            return res
                .status(400)
                .json({ message: "The Entered password does not match with your current password" });
        const deletedReviews = await reviewModel_1.default.find({ userId });
        await userModel_1.default.findByIdAndDelete(userId);
        await addressModel_1.default.deleteMany({ userId });
        await cartModel_1.default.findOneAndDelete({ userId });
        await orderModel_1.default.deleteMany({ userId });
        await reviewModel_1.default.deleteMany({ userId });
        await productModel_1.default.updateMany({ reviews: { $in: deletedReviews.map(review => review._id) } }, { $pull: { reviews: { $in: deletedReviews.map(review => review._id) } } });
        res
            .status(200)
            .json({ message: "User Deleted Successfully" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Sorry an error occured" });
    }
};
exports.deleteUser = deleteUser;
const logout = async (req, res) => {
    try {
        res
            .clearCookie('token')
            .json({ message: 'Logged out' });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Sorry an error occured" });
    }
};
exports.logout = logout;
