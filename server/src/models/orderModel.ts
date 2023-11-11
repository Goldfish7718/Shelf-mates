import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            totalPrice: Number
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subtotal: Number,
    confirmed: {
        type: Boolean,
        default: true
    }
})

const Order = mongoose.model('Order', orderSchema)
export default Order