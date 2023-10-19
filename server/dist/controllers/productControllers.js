"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.addProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
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
        const products = await productModel_1.default.find({ category: String(category) });
        const transformedProducts = products.map(product => {
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
        console.error(err);
        res
            .status(500).
            json({ message: 'Internal Server Error' });
    }
};
exports.getProducts = getProducts;
