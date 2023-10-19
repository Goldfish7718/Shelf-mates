import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
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

const Product = mongoose.model('Product', productSchema)
export default Product