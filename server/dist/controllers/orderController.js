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
const addressModel_1 = __importDefault(require("../models/addressModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-10-16'
});
const cartCheckout = async (req, res) => {
    try {
        const { userId } = req.params;
        const { paymentMethod, address } = req.body;
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
            addressId: address,
            paymentMethod,
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
            success_url: `${process.env.ORIGIN}/confirmation?orderId=${encodedOrderDetails}`,
            cancel_url: `${process.env.ORIGIN}/failed`,
        });
        const { url } = session;
        res.status(200).json({ url });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
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
            const potentialUser = await userModel_1.default.findById(orderObject.userId);
            await Promise.all(order.items.map(async (item) => {
                if (!(potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.productsPurchased.includes(item.productId))) {
                    potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.productsPurchased.push(item.productId);
                }
            }));
            await (potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.save());
        }
        const potentialUser = await userModel_1.default.findById(orderObject.userId);
        const productsPurchasedNew = potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.productsPurchased;
        orderObject.items = await Promise.all(orderObject.items.map(async (item) => {
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
        const address = await addressModel_1.default.findById(orderObject.addressId);
        orderObject.address = address;
        if (orderToEncode) {
            const orderDetails = JSON.stringify(orderToEncode);
            encodedOrderDetails = encodeURIComponent(orderDetails);
        }
        else {
            encodedOrderDetails = null;
        }
        res
            .status(200)
            .json({ orderObject, encodedOrderDetails, productsPurchasedNew });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.confirmOrder = confirmOrder;
