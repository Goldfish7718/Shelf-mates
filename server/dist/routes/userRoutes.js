"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = (0, express_1.Router)();
router.post('/signup', userControllers_1.signup);
router.post('/login', userControllers_1.login);
router.post('/logout', userControllers_1.logout);
router.get('/verify', verifyToken_1.default, (req, res) => {
    const { decode } = req;
    return res
        .status(200)
        .json({ isAuthenticated: true, decode, message: "Is Authenticated" });
});
router.get('/verifyadmin', verifyAdmin_1.default, (req, res) => {
    const { decode } = req;
    return res
        .status(200)
        .json({ isAuthenticated: true, decode, message: "Is Authenticated", isAdmin: true });
});
router.put('/update/:userId', verifyToken_1.default, userControllers_1.updateUser);
router.patch('/updatepassword/:userId', verifyToken_1.default, userControllers_1.changePassword);
router.delete('/delete/:userId', verifyToken_1.default, userControllers_1.deleteUser);
exports.default = router;
