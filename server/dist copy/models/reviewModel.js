"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stars: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
});
const Review = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = Review;
