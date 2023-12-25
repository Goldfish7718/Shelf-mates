import { Schema, model } from "mongoose";

const orderSchema = new Schema({
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
    addressId: {
        type: Schema.Types.ObjectId,
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
})

const Order = model('Order', orderSchema)
export default Order