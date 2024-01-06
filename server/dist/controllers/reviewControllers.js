"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = require("mongoose");
const addReview = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const { review, stars } = req.body;
        const user = await userModel_1.default.findById(userId);
        const productPurchased = user === null || user === void 0 ? void 0 : user.productsPurchased.includes(new mongoose_1.Types.ObjectId(productId));
        if (!productPurchased)
            return res
                .status(403)
                .json({ message: 'Product is not purchased' });
        const userReview = await reviewModel_1.default.create({
            productId,
            userId,
            stars,
            review
        });
        await productModel_1.default.findByIdAndUpdate(productId, {
            $push: {
                reviews: userReview._id
            }
        });
        res
            .status(200)
            .json({ message: "Review Posted Successfully" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal server Error" });
    }
};
exports.addReview = addReview;
