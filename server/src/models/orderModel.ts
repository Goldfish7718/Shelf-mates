import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subtotal: Number
})

const Order = mongoose.model('Order', orderSchema)
export default Order