"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fName: String,
    lName: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    productsPurchased: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
