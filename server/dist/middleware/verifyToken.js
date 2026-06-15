"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers["x-auth-header"] || req.body.token;
        if (req.cookies.token) {
            console.log("Token extracted from cookies");
        }
        else if (req.headers["x-auth-header"]) {
            console.log("Token extracted from header");
        }
        else if (req.body.token) {
            console.log("Token extracted from body");
        }
        else {
            console.log("No token found");
        }
        if (!token)
            return res.status(401).json({
                message: "User not authentiated",
                isAuthenticated: false,
            });
        const decode = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        req.decode = decode;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                message: err.message,
                isAuthenticated: false,
            });
        }
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            isAuthenticated: false,
        });
    }
};
exports.default = verifyToken;
