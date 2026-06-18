import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

interface Review {
    type: ObjectId;
}

export interface ProductDocument extends Document {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    stars: number;
    image: string;
    reviews: Review[];
}


const productSchema = new mongoose.Schema<ProductDocument>({
    name: String,
    price: Number,
    description: String,
    stock: {
        type: Number,
        default: 0
    },
    category: String,
    stars: {
        required: true,
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    image: {
        type: String,
        required: true
    },
    reviews: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Review'
        }
    ]
})

const Product = mongoose.model<ProductDocument>('Product', productSchema)
export default Product