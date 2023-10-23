"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../models/productModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const validateCart = async (req, res, next) => {
    const { productId, userId } = req.params;
    const operation = req.body.operation || 'increment';
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(403).json({ message: "Invalid User ID format" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID format" });
    }
    try {
        const potentialProduct = await productModel_1.default.findById(productId);
        const potentialCart = await cartModel_1.default.findOne({ userId });
        if (!potentialCart)
            return res
                .status(403)
                .json({ message: "This User Does Not Exist" });
        if (!potentialProduct)
            return res
                .status(400)
                .json({ message: "This Product Does not exist" });
        if (operation == 'increment' && potentialProduct.stock < 1)
            return res
                .status(400)
                .json({ message: "Cannot add more than avilable stock" });
        req.product = potentialProduct;
        req.cart = potentialCart;
        next();
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.default = validateCart;
