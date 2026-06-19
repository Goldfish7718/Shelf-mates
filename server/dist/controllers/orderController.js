"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.confirmOrder = exports.cartCheckout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const addressModel_1 = __importDefault(require("../models/addressModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: "2023-10-16",
});
const cartCheckout = async (req, res) => {
    try {
        if (!req.decode) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { _id: userId } = req.decode;
        const { paymentMethod, address } = req.body;
        const potentialCart = await cartModel_1.default.findOne({ userId });
        if (!potentialCart || potentialCart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty or does not exist" });
        }
        // 1. Stock Validation
        for (const item of potentialCart.cartItems) {
            const product = await productModel_1.default.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product: ${product.name}. Only ${product.stock} units available.`,
                });
            }
        }
        const prices = await Promise.all(potentialCart.cartItems.map(async (item) => {
            const product = await productModel_1.default.findById(item.productId);
            return product === null || product === void 0 ? void 0 : product.price;
        }));
        // 2. COD flow
        if (paymentMethod === "COD") {
            const order = await orderModel_1.default.create({
                items: potentialCart.cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    totalPrice: item.price,
                })),
                userId,
                addressId: address,
                paymentMethod,
                subtotal: potentialCart.subtotal,
                confirmed: true,
            });
            // Decrement stock
            await Promise.all(order.items.map(async (item) => {
                await productModel_1.default.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }));
            // Clear Cart
            await cartModel_1.default.findOneAndUpdate({ userId }, { $set: { cartItems: [], subtotal: 0 } });
            // Update User products purchased
            const user = await userModel_1.default.findById(userId);
            if (user) {
                order.items.forEach((item) => {
                    if (item.productId) {
                        const prodIdStr = item.productId.toString();
                        const purchasedStrings = user.productsPurchased.map((id) => id.toString());
                        if (!purchasedStrings.includes(prodIdStr)) {
                            user.productsPurchased.push(item.productId);
                        }
                    }
                });
                await user.save();
            }
            const url = `${process.env.ORIGIN}/confirmation?orderId=${order._id}`;
            return res.status(200).json({ url });
        }
        // 3. Card (Stripe) flow
        const order = await orderModel_1.default.create({
            items: potentialCart.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                totalPrice: item.price,
            })),
            userId,
            addressId: address,
            paymentMethod,
            subtotal: potentialCart.subtotal,
            confirmed: false,
        });
        const session = await stripe.checkout.sessions.create({
            client_reference_id: order._id.toString(),
            line_items: potentialCart.cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: prices[index] * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            mode: "payment",
            success_url: `${process.env.ORIGIN}/confirmation?orderId=${order._id}`,
            cancel_url: `${process.env.ORIGIN}/failed`,
        });
        res.status(200).json({ url: session.url });
    }
    catch (err) {
        console.error("Checkout error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.cartCheckout = cartCheckout;
const confirmOrder = async (req, res) => {
    var _a;
    try {
        const { orderId } = req.params;
        const order = await orderModel_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Security check: ensure order belongs to requesting user
        if (!order.userId || order.userId.toString() !== ((_a = req.decode) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({ message: "Unauthorized access to order" });
        }
        const potentialUser = await userModel_1.default.findById(order.userId);
        const productsPurchasedNew = potentialUser === null || potentialUser === void 0 ? void 0 : potentialUser.productsPurchased;
        const address = await addressModel_1.default.findById(order.addressId);
        const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
            const product = await productModel_1.default.findById(item.productId);
            const productObj = product.toObject();
            const { quantity } = item;
            return {
                ...productObj,
                quantity,
            };
        }));
        const orderObject = {
            ...order.toObject(),
            items: itemsWithDetails,
            address,
        };
        if (order.confirmed) {
            return res.status(200).json({
                orderObject,
                productsPurchasedNew,
                message: "Order placed Succesfully",
            });
        }
        else {
            // Return 200 but indicating it is not confirmed yet so client can poll
            return res.status(200).json({
                orderObject,
                productsPurchasedNew,
                message: "Order payment is pending verification.",
            });
        }
    }
    catch (err) {
        console.error("Confirm order error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.confirmOrder = confirmOrder;
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.client_reference_id;
        if (orderId) {
            try {
                const order = await orderModel_1.default.findById(orderId);
                if (order && !order.confirmed) {
                    order.confirmed = true;
                    await order.save();
                    // Decrement stock
                    await Promise.all(order.items.map(async (item) => {
                        await productModel_1.default.findByIdAndUpdate(item.productId, {
                            $inc: { stock: -item.quantity },
                        });
                    }));
                    // Clear user's cart
                    await cartModel_1.default.findOneAndUpdate({ userId: order.userId }, { $set: { cartItems: [], subtotal: 0 } });
                    // Update user's purchased products list
                    const user = await userModel_1.default.findById(order.userId);
                    if (user) {
                        order.items.forEach((item) => {
                            if (item.productId) {
                                const prodIdStr = item.productId.toString();
                                const purchasedStrings = user.productsPurchased.map((id) => id.toString());
                                if (!purchasedStrings.includes(prodIdStr)) {
                                    user.productsPurchased.push(item.productId);
                                }
                            }
                        });
                        await user.save();
                    }
                    console.log(`Order ${orderId} successfully confirmed via webhook.`);
                }
            }
            catch (err) {
                console.error(`Error processing webhook fulfillment for order ${orderId}:`, err);
                return res.status(500).send("Internal Server Error during fulfillment");
            }
        }
    }
    res.status(200).json({ received: true });
};
exports.stripeWebhook = stripeWebhook;
