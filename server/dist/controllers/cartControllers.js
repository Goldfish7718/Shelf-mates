"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.decrementQuantity = exports.addToCart = exports.getCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const mongoose_1 = require("mongoose");
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(userId))
            return res
                .status(400)
                .json({ message: 'Unavailabe ID' });
        const potentialCart = await cartModel_1.default.findOne({ userId });
        if (!potentialCart)
            return res
                .status(400)
                .json({ message: 'This Cart does not exist' });
        const { cartItems } = potentialCart;
        const { subtotal } = potentialCart;
        const transformedCart = cartItems.map(item => {
            const plainItem = item.toObject();
            const imageBase64 = plainItem.image.data.toString('base64');
            return {
                ...plainItem,
                image: `data:${plainItem.image.contentType};base64,${imageBase64}`
            };
        });
        res
            .status(200)
            .json({ transformedCart, subtotal });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }
        const { _id, price, name, image, stock } = req.product;
        const { cartItems } = req.cart;
        const productExists = cartItems.find(product => product.productId.toString() == _id.toString());
        const product = {
            productId: _id,
            quantity: 1,
            price,
            name,
            image
        };
        if (!productExists) {
            cartItems.push(product);
            req.cart.subtotal += product.price;
            await req.cart.save();
            return res
                .status(200)
                .json({
                message: "Added Item to Cart",
                productExists: product
            });
        }
        else {
            if (productExists.quantity + 1 > stock) {
                return res
                    .status(400)
                    .json({ message: "Cannot add more than available stock" });
            }
            else {
                productExists.quantity += 1;
                productExists.price = price * productExists.quantity;
            }
        }
        if (cartItems.length > 1)
            req.cart.subtotal = cartItems.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.price;
            }, 0);
        else if (cartItems.length == 0)
            req.cart.subtotal = 0;
        else if (cartItems.length == 1)
            req.cart.subtotal = cartItems[0].price;
        await req.cart.save();
        res
            .status(200)
            .json({
            message: "Added Item to Cart",
            productExists
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.addToCart = addToCart;
const decrementQuantity = async (req, res) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }
        const { _id, price } = req.product;
        const productExists = req.cart.cartItems.find(product => product.productId.toString() == _id.toString());
        if (!productExists)
            return res
                .status(400)
                .json({ message: "This Product Does not Exist" });
        else if (productExists.quantity == 1) {
            const product = productExists.toObject();
            const { price } = product;
            await cartModel_1.default.updateOne({ _id: req.cart._id }, {
                $pull: { cartItems: { productId: _id } },
                $inc: { subtotal: -price }
            });
            return res
                .status(200)
                .json({
                message: "Deleted Product from cart",
                productExists: {
                    ...product,
                    quantity: 0
                }
            });
        }
        else {
            productExists.quantity -= 1;
            productExists.price = price * productExists.quantity;
        }
        req.cart.subtotal = req.cart.cartItems.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price;
        }, 0);
        await req.cart.save();
        res
            .status(200)
            .json({ message: "Product Decremented", productExists });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.decrementQuantity = decrementQuantity;
const deleteProduct = async (req, res) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }
        const { _id } = req.product;
        const productExists = req.cart.cartItems.find(product => product.productId.toString() == _id.toString());
        if (!productExists)
            return res
                .status(400)
                .json({ message: "This Product Does not Exist" });
        const { price } = productExists;
        await cartModel_1.default.findOneAndUpdate({
            _id: req.cart._id
        }, {
            $pull: { cartItems: { productId: _id } },
            $inc: { subtotal: -price }
        });
        res
            .status(200)
            .json({ message: "Deleted Product from cart" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
exports.deleteProduct = deleteProduct;
