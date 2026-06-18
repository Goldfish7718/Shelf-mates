"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getAllProducts = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const addProduct = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "All Fields are required" });
        const { name, description, price, stock, category } = req.body;
        const { buffer } = req.file;
        const imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "shelf-mates" }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result.secure_url);
            });
            stream_1.Readable.from(buffer).pipe(uploadStream);
        });
        const newProduct = new productModel_1.default({
            name,
            description,
            price,
            stock,
            category,
            image: imageUrl,
        });
        await newProduct.save();
        res.status(200).json({ message: "Product Added Succesfully" });
    }
    catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await productModel_1.default.find({ category });
        res.status(200).json({ transformedProducts: products });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
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
            return res.status(404).json({ message: "This page does not exist" });
        const productObj = product.toObject();
        const reviews = await reviewModel_1.default.find({ productId: productObj._id }).limit(6);
        const transformedReviews = await Promise.all(reviews.map(async (review) => {
            const user = await userModel_1.default.findById(review.userId);
            const { fName, lName } = user;
            return {
                ...review.toObject(),
                fName,
                lName,
            };
        }));
        const sumStars = reviews.reduce((acc, currentValue) => {
            return acc + currentValue.stars;
        }, 0);
        const averageStars = Math.min(5, Math.floor((sumStars / reviews.length) * 100) / 100);
        const transformedProduct = {
            ...productObj,
            reviews: transformedReviews,
            reviewsLength: productObj.reviews.length,
            averageStars,
        };
        const isPurchased = user === null || user === void 0 ? void 0 : user.productsPurchased.includes(productObj._id);
        res.status(200).json({ transformedProduct, isPurchased });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getProduct = getProduct;
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find({});
        const transformedProducts = products.map((product) => {
            return {
                name: product.name,
                _id: product._id,
            };
        });
        res.status(200).json({ products: transformedProducts });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllProducts = getAllProducts;
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await cartModel_1.default.updateMany({ "cartItems.productId": productId }, { $pull: { cartItems: { productId: productId } } }, { multi: true });
        await reviewModel_1.default.deleteMany({ productId: productId });
        await orderModel_1.default.updateMany({ "items.productId": productId }, { $pull: { items: { productId: productId } } }, { multi: true });
        await userModel_1.default.updateMany({ productsPurchased: productId }, { $pull: { productsPurchased: productId } }, { multi: true });
        await productModel_1.default.findByIdAndDelete(productId);
        return res.status(200).json({ message: "Product Deleted Succesfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteProduct = deleteProduct;
