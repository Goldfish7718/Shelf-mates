"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
    category: String,
    image: {
        data: Buffer,
        contentType: String
    }
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
