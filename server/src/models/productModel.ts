import mongoose from "mongoose";
import { Document } from "mongoose";

interface Review {
    username: String;
    stars: Number;
    review: String;
}

export interface ProductDocument extends Document {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    stars: number;
    image: {
        data: Buffer;
        contentType: string;
    };
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
    stars: Number,
    image: {
        data: Buffer,
        contentType: String
    },
    reviews: [
        {
            username: String,
            stars: Number,
            review: String
        }
    ]
})

const Product = mongoose.model<ProductDocument>('Product', productSchema)
export default Product