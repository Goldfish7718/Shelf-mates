"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.deleteReview = exports.addReview = void 0;
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
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await reviewModel_1.default.findByIdAndDelete(reviewId);
        const { _id } = review;
        await productModel_1.default.findByIdAndUpdate(review === null || review === void 0 ? void 0 : review.productId, { $pull: { reviews: _id } });
        res
            .status(200)
            .json({ message: "Review Deleted Successfully" });
    }
    catch (err) {
        console.log(err);
    }
};
exports.deleteReview = deleteReview;
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const reviewSize = await reviewModel_1.default.find({ productId }).countDocuments();
        const end = skip * limit > reviewSize ? true : false;
        const reviews = await reviewModel_1.default.find({ productId })
            .sort({ stars: -1 })
            .skip(skip)
            .limit(limit);
        const transformedReviews = await Promise.all(reviews.map(async (review) => {
            const user = await userModel_1.default.findById(review.userId);
            return {
                ...review.toObject(),
                fName: user === null || user === void 0 ? void 0 : user.fName,
                lName: user === null || user === void 0 ? void 0 : user.lName,
                userId: review.userId
            };
        }));
        res
            .status(200)
            .json({ transformedReviews, end });
    }
    catch (err) {
        return res
            .status(200)
            .json({ message: "Internal Server Error" });
    }
};
exports.getReviews = getReviews;
