"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    items: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            totalPrice: Number
        }
    ],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    addressId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Address'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    subtotal: Number,
    confirmed: {
        type: Boolean,
        default: true
    }
});
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
