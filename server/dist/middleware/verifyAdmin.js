"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            return res
                .status(401)
                .json({
                message: "No Token",
                isAuthenticated: false
            });
        const decode = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        // @ts-ignore
        if (!decode.isAdmin)
            return res
                .status(403)
                .json({ message: 'You are not authorized to access this route' });
        req.decode = decode;
        next();
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Sorry an error occured" });
    }
};
exports.default = verifyAdmin;
