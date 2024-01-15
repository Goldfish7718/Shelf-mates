import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface CartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
    image: {
        data: Buffer;
        contentType: string;
    };
}

export interface CartDocument extends Document {
    cartItems: CartItem[];
    userId: mongoose.Types.ObjectId;
    subtotal: number;
}


const cartSchema = new mongoose.Schema<CartDocument>({
    cartItems: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number,
            name: String,
            image: {
                data: Buffer,
                contentType: String
            }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtotal: {
        type: Number,
        default: 0
    }
})

const Cart = mongoose.model<CartDocument>('Cart', cartSchema)
export default Cart