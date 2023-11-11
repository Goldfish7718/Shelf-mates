"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmOrder = exports.cartCheckout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-10-16'
});
const cartCheckout = async (req, res) => {
    try {
        const { userId } = req.params;
        const potentialCart = await cartModel_1.default.findOne({ userId });
        if (!potentialCart) {
            return res.status(403).json({ message: "This User Does Not Exist" });
        }
        const prices = await Promise.all(potentialCart === null || potentialCart === void 0 ? void 0 : potentialCart.cartItems.map(async (item) => {
            const product = await productModel_1.default.findById(item.productId);
            return product === null || product === void 0 ? void 0 : product.price;
        }));
        const order = {
            items: potentialCart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                totalPrice: item.price
            })),
            userId,
            subtotal: potentialCart.subtotal,
            confirmed: false
        };
        const orderDetails = JSON.stringify(order);
        const encodedOrderDetails = encodeURIComponent(orderDetails);
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
            success_url: `http://localhost:5173/confirmation?orderId=${encodedOrderDetails}`,
            cancel_url: `http://localhost:5173/failed`,
        });
        const { url } = session;
        res.status(200).json({ url });
    }
    catch (err) {
        res.send(err);
    }
};
exports.cartCheckout = cartCheckout;
const confirmOrder = async (req, res) => {
    try {
        const { encode } = req.params;
        const decodedOrderDetails = decodeURIComponent(encode);
        const orderObject = JSON.parse(decodedOrderDetails);
        let orderToEncode;
        let encodedOrderDetails;
        if (orderObject.confirmed != true) {
            orderObject.confirmed = true;
            const order = await orderModel_1.default.create(orderObject);
            orderToEncode = order;
            await cartModel_1.default.findOneAndUpdate({ userId: order.userId }, {
                $set: {
                    cartItems: [],
                    subtotal: 0
                }
            });
            order.items.map(async (item) => {
                await productModel_1.default.findByIdAndUpdate(item.productId, {
                    $inc: {
                        stock: -item.quantity
                    }
                });
            });
        }
        const transformedProducts = await Promise.all(orderObject.items.map(async (item) => {
            const product = await productModel_1.default.findById(item.productId);
            const productObj = product.toObject();
            const imageBase64 = productObj.image.data.toString('base64');
            const { quantity } = item;
            return {
                ...productObj,
                image: `data:${productObj.image.contentType};base64,${imageBase64}`,
                quantity
            };
        }));
        if (orderToEncode) {
            const orderDetails = JSON.stringify(orderToEncode);
            encodedOrderDetails = encodeURIComponent(orderDetails);
        }
        else {
            encodedOrderDetails = null;
        }
        res
            .status(200)
            .json({ transformedProducts, encodedOrderDetails });
    }
    catch (err) {
        console.log(err);
    }
};
exports.confirmOrder = confirmOrder;
