"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const addProduct = async (req, res) => {
    try {
        if (!req.file)
            return res
                .status(400)
                .json({ message: "All Fields are required" });
        const { name, description, price, stock, category } = req.body;
        const { buffer, mimetype } = req.file;
        const newProduct = new productModel_1.default({
            name,
            description,
            price,
            stock,
            category,
            image: {
                data: buffer,
                contentType: mimetype
            }
        });
        await newProduct.save();
        res
            .status(200)
            .json({ message: 'Product Added Succesfully' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await productModel_1.default.find({ category });
        let transformedProducts = products.map(product => {
            const productObj = product.toObject();
            if (!productObj.image || !productObj.image.data) {
                return res
                    .status(500)
                    .json({ message: 'Internal Server Error' });
            }
            const imageBase64 = productObj.image.data.toString('base64');
            return {
                ...productObj,
                image: `data:${productObj.image.contentType};base64,${imageBase64}`
            };
        });
        res
            .status(200)
            .json({ transformedProducts });
    }
    catch (err) {
        res
            .status(500).
            json({ message: 'Internal Server Error' });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { decode } = req;
        const product = await productModel_1.default.findById(id);
        const user = await userModel_1.default.findById(decode === null || decode === void 0 ? void 0 : decode._id);
        if (!product)
            return res
                .status(404)
                .json({ message: 'This page does not exist' });
        const productObj = product.toObject();
        if (!productObj.image || !productObj.image.data) {
            return res
                .status(500)
                .json({ message: 'Internal Server Error' });
        }
        const reviews = await reviewModel_1.default.find({ productId: productObj._id }).limit(6);
        const transformedReviews = await Promise.all(reviews.map(async (review) => {
            const user = await userModel_1.default.findById(review.userId);
            const { fName, lName } = user;
            return {
                ...review.toObject(),
                fName,
                lName
            };
        }));
        const sumStars = reviews.reduce((acc, currentValue) => {
            return acc + currentValue.stars;
        }, 0);
        const averageStars = Math.min(5, Math.floor((sumStars / reviews.length) * 100) / 100);
        const imageBase64 = productObj.image.data.toString('base64');
        const transformedProduct = {
            ...productObj,
            image: `data:${productObj.image.contentType};base64,${imageBase64}`,
            reviews: transformedReviews,
            reviewsLength: productObj.reviews.length,
            averageStars
        };
        const isPurchased = user === null || user === void 0 ? void 0 : user.productsPurchased.includes(productObj._id);
        res
            .status(200)
            .json({ transformedProduct, isPurchased });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.getProduct = getProduct;
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await cartModel_1.default.updateMany({ 'cartItems.productId': productId }, { $pull: { cartItems: { productId: productId } } }, { multi: true });
        await reviewModel_1.default.deleteMany({ 'productId': productId });
        await orderModel_1.default.updateMany({ 'items.productId': productId }, { $pull: { items: { productId: productId } } }, { multi: true });
        await userModel_1.default.updateMany({ 'productsPurchased': productId }, { $pull: { productsPurchased: productId } }, { multi: true });
        await productModel_1.default.findByIdAndDelete(productId);
        return res
            .status(200)
            .json({ message: "Product Deleted Succesfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.deleteProduct = deleteProduct;
