import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
    category: String,
    image: {
        data: Buffer,
        contentType: String
    }
})

const Product = mongoose.model('Product', productSchema)
export default Product