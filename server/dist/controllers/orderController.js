"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartCheckout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-10-16'
});
const cartCheckout = async (req, res) => {
    try {
        const { userId } = req.params;
        const potentialCart = await cartModel_1.default.findOne({ userId });
        if (!potentialCart)
            return res
                .status(403)
                .json({ message: "This User Does Not Exist" });
        const prices = await Promise.all(potentialCart === null || potentialCart === void 0 ? void 0 : potentialCart.cartItems.map(async (item) => {
            const product = await productModel_1.default.findById(item.productId);
            return product === null || product === void 0 ? void 0 : product.price;
        }));
        const session = await stripe.checkout.sessions.create({
            line_items: potentialCart.cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name
                        },
                        unit_amount: prices[index] * 100
                    },
                    quantity: item.quantity
                };
            }),
            mode: 'payment',
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/failed`,
        });
        const { url } = session;
        res
            .status(200)
            .json({ url });
    }
    catch (err) {
        res.send(err);
    }
};
exports.cartCheckout = cartCheckout;
