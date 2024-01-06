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
    stock: {
        type: Number,
        default: 0
    },
    category: String,
    stars: {
        required: true,
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    image: {
        data: Buffer,
        contentType: String
    },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: 'Review'
        }
    ]
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
